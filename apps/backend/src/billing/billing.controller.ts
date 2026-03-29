import {
  Controller,
  Post,
  Body,
  Res,
  Req,
  RawBodyRequest,
  HttpStatus,
} from '@nestjs/common';
import { BillingService } from './billing.service';
import { Response, Request } from 'express';

@Controller('billing')
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Post('create-checkout-session')
  async createCheckoutSession(
    @Body('priceId') priceId: string,
    @Body('customerId') customerId: string,
    @Body('successUrl') successUrl: string,
    @Body('cancelUrl') cancelUrl: string,
    @Res() res: Response,
  ) {
    try {
      const session = await this.billingService.createCheckoutSession(
        customerId, // clientId
        priceId,
        1, // quantity - assumindo 1 por enquanto, pode ser parametrizado no futuro
        'Stripe Checkout Session', // description - pode ser parametrizado no futuro
        successUrl,
        cancelUrl,
      );
      return res.json({ url: session.url });
    } catch (error) {
      const err = error as Error;
      if (err.message === 'Stripe billing is not enabled.') {
        return res
          .status(HttpStatus.SERVICE_UNAVAILABLE)
          .json({ message: err.message });
      }
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: err.message });
    }
  }

  @Post('webhooks')
  async handleWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Res() res: Response,
  ) {
    const sig = req.headers['stripe-signature'];
    const rawBody = req.rawBody;

    if (!rawBody) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send('Webhook Error: Request body is missing.');
    }
    try {
      await this.billingService.handleWebhook(rawBody, sig as string);
      return res.status(HttpStatus.OK).send();
    } catch (error) {
      const err = error as Error;
      console.error('Error handling Stripe webhook:', err.message);
      if (err.message.includes('Webhook signature verification failed')) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .send(`Webhook Error: ${err.message}`);
      }
      if (err.message === 'Stripe billing is not enabled.') {
        return res
          .status(HttpStatus.SERVICE_UNAVAILABLE)
          .json({ message: err.message });
      }
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send(`Webhook Error: ${err.message}`);
    }
  }
}
