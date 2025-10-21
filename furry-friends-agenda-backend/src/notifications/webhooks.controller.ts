import {
  Controller,
  Post,
  Get,
  Body,
  Headers,
  Query,
  UseGuards,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { WebhookService } from './webhook.service';
import {
  TwilioSMSWebhookPayload,
  TwilioWhatsAppWebhookPayload,
  SendGridEmailWebhookPayload,
  WhatsAppBusinessWebhookPayload,
  TestWebhookData,
} from '../types/webhook.types';

@Controller('webhooks/notifications')
export class NotificationWebhooksController {
  private readonly logger = new Logger(NotificationWebhooksController.name);

  constructor(private readonly webhookService: WebhookService) {}

  @Post('twilio-sms')
  async handleTwilioSMSWebhook(
    @Body() body: TwilioSMSWebhookPayload,
    @Headers() headers: Record<string, string>,
  ) {
    this.logger.log('Webhook Twilio SMS recebido:', { body, headers });

    // Verificar assinatura do Twilio (se configurada)
    if (process.env.TWILIO_AUTH_TOKEN) {
      const twilioSignature = headers['x-twilio-signature'];
      if (!twilioSignature) {
        throw new BadRequestException('Assinatura Twilio ausente');
      }

      // Em uma implementação completa, você verificaria a assinatura
      // const isValidSignature = this.verifyTwilioSignature(body, twilioSignature);
      // if (!isValidSignature) {
      //   throw new BadRequestException('Assinatura Twilio inválida');
      // }
    }

    return this.webhookService.processTwilioSMSWebhook(body);
  }

  @Post('twilio-whatsapp')
  async handleTwilioWhatsAppWebhook(
    @Body() body: TwilioWhatsAppWebhookPayload,
    @Headers() headers: Record<string, string>,
  ) {
    this.logger.log('Webhook Twilio WhatsApp recebido:', { body, headers });

    return this.webhookService.processTwilioWhatsAppWebhook(body);
  }

  @Post('sendgrid-email')
  async handleSendGridEmailWebhook(
    @Body() body: SendGridEmailWebhookPayload[],
    @Headers() headers: Record<string, string>,
  ) {
    this.logger.log('Webhook SendGrid recebido:', { body, headers });

    // Verificar assinatura do SendGrid (se configurada)
    if (process.env.SENDGRID_WEBHOOK_VERIFICATION_KEY) {
      // const signature = headers['x-sendgrid-signature']; // Corrigir header
      // Implementar verificação de assinatura
    }

    return this.webhookService.processSendGridEmailWebhook(body);
  }

  @Post('whatsapp-business')
  async handleWhatsAppBusinessWebhook(
    @Body() body: WhatsAppBusinessWebhookPayload,
    @Headers() headers: Record<string, string>,
  ) {
    this.logger.log('Webhook WhatsApp Business recebido:', { body, headers });

    // Verificar assinatura do WhatsApp (se configurada)
    if (process.env.WHATSAPP_VERIFY_TOKEN) {
      // const signature = headers['x-hub-signature-256'];
      // Implementar verificação de assinatura
    }

    return this.webhookService.processWhatsAppBusinessWebhook(body);
  }

  @Get('twilio-sms')
  handleTwilioSMSVerification(@Query('accountSid') accountSid?: string) {
    // Para verificação inicial do webhook do Twilio
    return { message: 'Webhook verificado', accountSid };
  }

  @Get('whatsapp-business')
  handleWhatsAppVerification(
    @Query('hub.mode') mode: string,
    @Query('hub.challenge') challenge: string,
    @Query('hub.verify_token') verifyToken: string,
  ) {
    // Verificação do webhook do WhatsApp Business
    if (
      mode === 'subscribe' &&
      verifyToken === process.env.WHATSAPP_VERIFY_TOKEN
    ) {
      return challenge;
    }

    throw new BadRequestException('Token de verificação inválido');
  }
}

@Controller('admin/notification-webhooks')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminNotificationWebhooksController {
  private readonly logger = new Logger(
    AdminNotificationWebhooksController.name,
  );

  constructor(private readonly webhookService: WebhookService) {}

  @Get('logs')
  getWebhookLogs(
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
    @Query('provider') provider?: string,
  ) {
    return this.webhookService.getWebhookLogs({
      limit: limit ? parseInt(limit) : 50,
      offset: offset ? parseInt(offset) : 0,
      provider,
    });
  }

  @Get('stats')
  getWebhookStats() {
    return this.webhookService.getWebhookStats();
  }

  @Post('test/:provider')
  testWebhook(
    @Query('provider') provider: string,
    @Body() testData?: TestWebhookData,
  ) {
    return this.webhookService.testWebhook(provider, testData);
  }
}
