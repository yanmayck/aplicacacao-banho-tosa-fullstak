import { Test, TestingModule } from '@nestjs/testing';
import { BillingController } from './billing.controller';
import { BillingService } from './billing.service';
import { Response, Request } from 'express';
import { RawBodyRequest, HttpStatus } from '@nestjs/common';
import Stripe from 'stripe';

describe('BillingController', () => {
  let controller: BillingController;
  let billingService: jest.Mocked<BillingService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BillingController],
      providers: [
        {
          provide: BillingService,
          useValue: {
            createCheckoutSession: jest.fn(),
            handleWebhook: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<BillingController>(BillingController);
    billingService = module.get(BillingService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createCheckoutSession', () => {
    it('should return a session URL on successful creation', async () => {
      const mockSession = { url: 'http://stripe.checkout.url' };
      billingService.createCheckoutSession.mockResolvedValue(
        mockSession as unknown as Stripe.Response<Stripe.Checkout.Session>,
      );

      const res = {
        json: jest.fn().mockReturnThis(),
        status: jest.fn().mockReturnThis(),
      } as unknown as Response;

      await controller.createCheckoutSession(
        'price_123',
        'client_123',
        'http://success.url',
        'http://cancel.url',
        res,
      );

      expect(billingService.createCheckoutSession).toHaveBeenCalledWith(
        'client_123',
        'price_123',
        1,
        'Stripe Checkout Session',
        'http://success.url',
        'http://cancel.url',
      );
      expect(res.json).toHaveBeenCalledWith({ url: mockSession.url });
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should return SERVICE_UNAVAILABLE if Stripe billing is not enabled', async () => {
      billingService.createCheckoutSession.mockRejectedValue(
        new Error('Stripe billing is not enabled.'),
      );

      const res = {
        json: jest.fn().mockReturnThis(),
        status: jest.fn().mockReturnThis(),
      } as unknown as Response;

      await controller.createCheckoutSession(
        'price_123',
        'client_123',
        'http://success.url',
        'http://cancel.url',
        res,
      );

      expect(res.status).toHaveBeenCalledWith(HttpStatus.SERVICE_UNAVAILABLE);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Stripe billing is not enabled.',
      });
    });

    it('should return INTERNAL_SERVER_ERROR for other errors', async () => {
      billingService.createCheckoutSession.mockRejectedValue(
        new Error('Something went wrong.'),
      );

      const res = {
        json: jest.fn().mockReturnThis(),
        status: jest.fn().mockReturnThis(),
      } as unknown as Response;

      await controller.createCheckoutSession(
        'price_123',
        'client_123',
        'http://success.url',
        'http://cancel.url',
        res,
      );

      expect(res.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Something went wrong.',
      });
    });
  });

  describe('handleWebhook', () => {
    it('should return OK on successful webhook handling', async () => {
      billingService.handleWebhook.mockResolvedValue(undefined);

      const req = {
        headers: { 'stripe-signature': 'sig_123' },
        rawBody: Buffer.from('{}'),
      } as unknown as Request;

      const res = {
        send: jest.fn().mockReturnThis(),
        status: jest.fn().mockReturnThis(),
      } as unknown as Response;

      await controller.handleWebhook(req as RawBodyRequest<Request>, res);

      expect(billingService.handleWebhook).toHaveBeenCalledWith(
        Buffer.from('{}'),
        'sig_123',
      );
      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.send).toHaveBeenCalled();
    });

    it('should return BAD_REQUEST if rawBody is missing', async () => {
      const req = {
        headers: { 'stripe-signature': 'sig_123' },
        rawBody: undefined,
      } as unknown as Request;

      const res = {
        send: jest.fn().mockReturnThis(),
        status: jest.fn().mockReturnThis(),
      } as unknown as Response;

      await controller.handleWebhook(req as RawBodyRequest<Request>, res);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(res.send).toHaveBeenCalledWith(
        'Webhook Error: Request body is missing.',
      );
    });

    it('should return BAD_REQUEST if signature verification fails', async () => {
      billingService.handleWebhook.mockRejectedValue(
        new Error('Webhook signature verification failed.'),
      );

      const req = {
        headers: { 'stripe-signature': 'invalid_sig' },
        rawBody: Buffer.from('{}'),
      } as unknown as Request;

      const res = {
        send: jest.fn().mockReturnThis(),
        status: jest.fn().mockReturnThis(),
      } as unknown as Response;

      await controller.handleWebhook(req as RawBodyRequest<Request>, res);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(res.send).toHaveBeenCalledWith(
        'Webhook Error: Webhook signature verification failed.',
      );
    });

    it('should return SERVICE_UNAVAILABLE if Stripe billing is not enabled', async () => {
      billingService.handleWebhook.mockRejectedValue(
        new Error('Stripe billing is not enabled.'),
      );

      const req = {
        headers: { 'stripe-signature': 'sig_123' },
        rawBody: Buffer.from('{}'),
      } as unknown as Request;

      const res = {
        json: jest.fn().mockReturnThis(),
        status: jest.fn().mockReturnThis(),
        send: jest.fn().mockReturnThis(),
      } as unknown as Response;

      await controller.handleWebhook(req as RawBodyRequest<Request>, res);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.SERVICE_UNAVAILABLE);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Stripe billing is not enabled.',
      });
    });

    it('should return INTERNAL_SERVER_ERROR for other errors', async () => {
      billingService.handleWebhook.mockRejectedValue(
        new Error('Generic webhook error.'),
      );

      const req = {
        headers: { 'stripe-signature': 'sig_123' },
        rawBody: Buffer.from('{}'),
      } as unknown as Request;

      const res = {
        send: jest.fn().mockReturnThis(),
        status: jest.fn().mockReturnThis(),
      } as unknown as Response;

      await controller.handleWebhook(req as RawBodyRequest<Request>, res);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(res.send).toHaveBeenCalledWith(
        'Webhook Error: Generic webhook error.',
      );
    });
  });
});
