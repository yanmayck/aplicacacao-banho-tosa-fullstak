import { Test, TestingModule } from '@nestjs/testing';
import { BillingService } from './billing.service';
import { PrismaService } from '../prisma/prisma.service';
import Stripe from 'stripe';

// Mock do Stripe
jest.mock('stripe', () => {
  const StripeMock = jest.fn().mockImplementation(() => ({
    customers: {
      create: jest.fn(),
    },
    checkout: {
      sessions: {
        create: jest.fn(),
      },
    },
    webhooks: {
      constructEvent: jest.fn(),
    },
    products: {
      create: jest.fn(),
      update: jest.fn(),
    },
    prices: {
      create: jest.fn(),
      update: jest.fn(),
    },
  }));
  return StripeMock;
});

describe('BillingService', () => {
  let service: BillingService;
  let prisma: PrismaService;
  let stripe: jest.Mocked<Stripe>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BillingService,
        {
          provide: PrismaService,
          useValue: {
            client: {
              findUnique: jest.fn(),
              update: jest.fn(),
              updateMany: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<BillingService>(BillingService);
    prisma = module.get<PrismaService>(PrismaService);
    stripe = new Stripe('sk_test_123') as jest.Mocked<Stripe>;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Stripe Integration (STRIPE_BILLING_ENABLED)', () => {
    const originalEnv = process.env;

    beforeEach(() => {
      jest.resetModules();
      process.env = { ...originalEnv };
    });

    afterAll(() => {
      process.env = originalEnv;
    });

    it('should initialize Stripe when STRIPE_BILLING_ENABLED is true', () => {
      process.env.STRIPE_BILLING_ENABLED = 'true';
      process.env.STRIPE_SECRET_KEY = 'test_key';
      const newService = new BillingService(prisma);
      newService.onModuleInit();
      expect(Stripe).toHaveBeenCalledWith('test_key', expect.any(Object));
    });

    it('should not initialize Stripe when STRIPE_BILLING_ENABLED is false', () => {
      process.env.STRIPE_BILLING_ENABLED = 'false';
      const newService = new BillingService(prisma);
      newService.onModuleInit();
      expect(Stripe).not.toHaveBeenCalled();
    });

    it('should throw an error if Stripe is not enabled for createStripeProduct', async () => {
      process.env.STRIPE_BILLING_ENABLED = 'false';
      const newService = new BillingService(prisma);
      newService.onModuleInit();
      await expect(
        newService.createStripeProduct('Test Product'),
      ).rejects.toThrow('Stripe billing is not enabled.');
    });

    it('should throw an error if Stripe is not enabled for updateStripeProduct', async () => {
      process.env.STRIPE_BILLING_ENABLED = 'false';
      const newService = new BillingService(prisma);
      newService.onModuleInit();
      await expect(
        newService.updateStripeProduct('prod_123', 'Updated Product'),
      ).rejects.toThrow('Stripe billing is not enabled.');
    });

    it('should throw an error if Stripe is not enabled for archiveStripeProduct', async () => {
      process.env.STRIPE_BILLING_ENABLED = 'false';
      const newService = new BillingService(prisma);
      newService.onModuleInit();
      await expect(newService.archiveStripeProduct('prod_123')).rejects.toThrow(
        'Stripe billing is not enabled.',
      );
    });

    it('should throw an error if Stripe is not enabled for createStripePrice', async () => {
      process.env.STRIPE_BILLING_ENABLED = 'false';
      const newService = new BillingService(prisma);
      newService.onModuleInit();
      await expect(
        newService.createStripePrice('prod_123', 100),
      ).rejects.toThrow('Stripe billing is not enabled.');
    });

    it('should throw an error if Stripe is not enabled for archiveStripePrice', async () => {
      process.env.STRIPE_BILLING_ENABLED = 'false';
      const newService = new BillingService(prisma);
      newService.onModuleInit();
      await expect(newService.archiveStripePrice('price_123')).rejects.toThrow(
        'Stripe billing is not enabled.',
      );
    });

    it('should throw an error if Stripe is not enabled for createCheckoutSession', async () => {
      process.env.STRIPE_BILLING_ENABLED = 'false';
      const newService = new BillingService(prisma);
      newService.onModuleInit();
      await expect(
        newService.createCheckoutSession(
          'client1',
          'price1',
          1,
          'desc',
          'success',
          'cancel',
        ),
      ).rejects.toThrow('Stripe billing is not enabled.');
    });

    it('should throw an error if Stripe is not enabled for handleWebhook', async () => {
      process.env.STRIPE_BILLING_ENABLED = 'false';
      const newService = new BillingService(prisma);
      newService.onModuleInit();
      await expect(
        newService.handleWebhook(Buffer.from(''), 'signature'),
      ).rejects.toThrow('Stripe billing is not enabled.');
    });
  });

  describe('createStripeProduct', () => {
    beforeEach(() => {
      process.env.STRIPE_BILLING_ENABLED = 'true';
      process.env.STRIPE_SECRET_KEY = 'test_key';
      service.onModuleInit(); // Re-initialize service to enable Stripe
    });

    it('should create a Stripe product', async () => {
      const mockProduct = {
        id: 'prod_test',
        name: 'Test Product',
        type: 'service',
      };
      (stripe.products.create as jest.Mock).mockResolvedValue(mockProduct);

      const product = await service.createStripeProduct(
        'Test Product',
        'Description',
      );
      expect(stripe.products.create).toHaveBeenCalledWith({
        name: 'Test Product',
        description: 'Description',
        type: 'service',
      });
      expect(product).toEqual(mockProduct);
    });
  });

  describe('updateStripeProduct', () => {
    beforeEach(() => {
      process.env.STRIPE_BILLING_ENABLED = 'true';
      process.env.STRIPE_SECRET_KEY = 'test_key';
      service.onModuleInit();
    });

    it('should update a Stripe product', async () => {
      const mockProduct = { id: 'prod_test', name: 'Updated Product' };
      (stripe.products.update as jest.Mock).mockResolvedValue(mockProduct);

      const product = await service.updateStripeProduct(
        'prod_test',
        'Updated Product',
      );
      expect(stripe.products.update).toHaveBeenCalledWith('prod_test', {
        name: 'Updated Product',
        description: undefined,
      });
      expect(product).toEqual(mockProduct);
    });
  });

  describe('archiveStripeProduct', () => {
    beforeEach(() => {
      process.env.STRIPE_BILLING_ENABLED = 'true';
      process.env.STRIPE_SECRET_KEY = 'test_key';
      service.onModuleInit();
    });

    it('should archive a Stripe product', async () => {
      const mockProduct = { id: 'prod_test', active: false };
      (stripe.products.update as jest.Mock).mockResolvedValue(mockProduct);

      const product = await service.archiveStripeProduct('prod_test');
      expect(stripe.products.update).toHaveBeenCalledWith('prod_test', {
        active: false,
      });
      expect(product).toEqual(mockProduct);
    });
  });

  describe('createStripePrice', () => {
    beforeEach(() => {
      process.env.STRIPE_BILLING_ENABLED = 'true';
      process.env.STRIPE_SECRET_KEY = 'test_key';
      service.onModuleInit();
    });

    it('should create a Stripe price', async () => {
      const mockPrice = { id: 'price_test', unit_amount: 10000 };
      (stripe.prices.create as jest.Mock).mockResolvedValue(mockPrice);

      const price = await service.createStripePrice('prod_test', 100);
      expect(stripe.prices.create).toHaveBeenCalledWith({
        unit_amount: 10000,
        currency: 'brl',
        product: 'prod_test',
        recurring: { interval: 'month' },
      });
      expect(price).toEqual(mockPrice);
    });
  });

  describe('archiveStripePrice', () => {
    beforeEach(() => {
      process.env.STRIPE_BILLING_ENABLED = 'true';
      process.env.STRIPE_SECRET_KEY = 'test_key';
      service.onModuleInit();
    });

    it('should archive a Stripe price', async () => {
      const mockPrice = { id: 'price_test', active: false };
      (stripe.prices.update as jest.Mock).mockResolvedValue(mockPrice);

      const price = await service.archiveStripePrice('price_test');
      expect(stripe.prices.update).toHaveBeenCalledWith('price_test', {
        active: false,
      });
      expect(price).toEqual(mockPrice);
    });
  });

  describe('createCheckoutSession', () => {
    beforeEach(() => {
      process.env.STRIPE_BILLING_ENABLED = 'true';
      process.env.STRIPE_SECRET_KEY = 'test_key';
      service.onModuleInit();
    });

    it('should create a checkout session for an existing Stripe customer', async () => {
      const mockClient = {
        id: 'client1',
        name: 'Test Client',
        email: 'test@example.com',
        stripeCustomerId: 'cus_existing',
        stripeSubscriptionId: null,
        stripeSubscriptionStatus: null,
      };
      const mockSession = { id: 'cs_test', url: 'http://checkout.stripe.com' };

      (prisma.client.findUnique as jest.Mock).mockResolvedValue(mockClient);
      (stripe.checkout.sessions.create as jest.Mock).mockResolvedValue(
        mockSession,
      );

      const session = await service.createCheckoutSession(
        'client1',
        'price1',
        1,
        'desc',
        'success',
        'cancel',
      );

      expect(prisma.client.findUnique).toHaveBeenCalledWith({
        where: { id: 'client1' },
        select: expect.any(Object),
      });
      expect(stripe.customers.create).not.toHaveBeenCalled();
      expect(stripe.checkout.sessions.create).toHaveBeenCalledWith({
        payment_method_types: ['card'],
        line_items: [{ price: 'price1', quantity: 1 }],
        mode: 'payment',
        success_url: 'success',
        cancel_url: 'cancel',
        customer: 'cus_existing',
        client_reference_id: 'client1',
        metadata: { description: 'desc' },
      });
      expect(session).toEqual(mockSession);
    });

    it('should create a checkout session and a new Stripe customer', async () => {
      const mockClient = {
        id: 'client1',
        name: 'Test Client',
        email: 'test@example.com',
        stripeCustomerId: null,
        stripeSubscriptionId: null,
        stripeSubscriptionStatus: null,
      };
      const mockCustomer = { id: 'cus_new' };
      const mockSession = { id: 'cs_test', url: 'http://checkout.stripe.com' };

      (prisma.client.findUnique as jest.Mock).mockResolvedValue(mockClient);
      (stripe.customers.create as jest.Mock).mockResolvedValue(mockCustomer);
      (stripe.checkout.sessions.create as jest.Mock).mockResolvedValue(
        mockSession,
      );
      (prisma.client.update as jest.Mock).mockResolvedValue({
        ...mockClient,
        stripeCustomerId: 'cus_new',
      });

      const session = await service.createCheckoutSession(
        'client1',
        'price1',
        1,
        'desc',
        'success',
        'cancel',
      );

      expect(prisma.client.findUnique).toHaveBeenCalledWith({
        where: { id: 'client1' },
        select: expect.any(Object),
      });
      expect(stripe.customers.create).toHaveBeenCalledWith({
        email: 'test@example.com',
        name: 'Test Client',
        metadata: { our_system_id: 'client1' },
      });
      expect(prisma.client.update).toHaveBeenCalledWith({
        where: { id: 'client1' },
        data: { stripeCustomerId: 'cus_new' },
      });
      expect(stripe.checkout.sessions.create).toHaveBeenCalledWith({
        payment_method_types: ['card'],
        line_items: [{ price: 'price1', quantity: 1 }],
        mode: 'payment',
        success_url: 'success',
        cancel_url: 'cancel',
        customer: 'cus_new',
        client_reference_id: 'client1',
        metadata: { description: 'desc' },
      });
      expect(session).toEqual(mockSession);
    });

    it('should throw an error if client not found', async () => {
      (prisma.client.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(
        service.createCheckoutSession(
          'client1',
          'price1',
          1,
          'desc',
          'success',
          'cancel',
        ),
      ).rejects.toThrow('Client with ID client1 not found.');
    });
  });

  describe('handleWebhook', () => {
    const originalEnv = process.env;

    beforeEach(() => {
      jest.resetModules();
      process.env = {
        ...originalEnv,
        STRIPE_BILLING_ENABLED: 'true',
        STRIPE_WEBHOOK_SECRET: 'wh_test',
      };
      service = new BillingService(prisma);
      service.onModuleInit();
    });

    afterAll(() => {
      process.env = originalEnv;
    });

    it('should throw error if signature verification fails', async () => {
      (stripe.webhooks.constructEvent as jest.Mock).mockImplementation(() => {
        throw new Error('No signature');
      });

      await expect(
        service.handleWebhook(Buffer.from('{}'), 'invalid_sig'),
      ).rejects.toThrow('Webhook Error: No signature');
    });

    it('should handle checkout.session.completed event', async () => {
      const mockEvent = {
        type: 'checkout.session.completed',
        data: {
          object: {
            client_reference_id: 'client1',
            customer: 'cus_test',
          },
        },
      };
      (stripe.webhooks.constructEvent as jest.Mock).mockReturnValue(mockEvent);
      (prisma.client.update as jest.Mock).mockResolvedValue({});

      await service.handleWebhook(Buffer.from('{}'), 'valid_sig');

      expect(prisma.client.update).toHaveBeenCalledWith({
        where: { id: 'client1' },
        data: {
          stripeCustomerId: 'cus_test',
        },
      });
    });

    it('should handle customer.subscription.updated event', async () => {
      const mockEvent = {
        type: 'customer.subscription.updated',
        data: {
          object: {
            id: 'sub_test',
            status: 'active',
          },
        },
      };
      (stripe.webhooks.constructEvent as jest.Mock).mockReturnValue(mockEvent);
      (prisma.client.updateMany as jest.Mock).mockResolvedValue({});

      await service.handleWebhook(Buffer.from('{}'), 'valid_sig');

      expect(prisma.client.updateMany).toHaveBeenCalledWith({
        where: { stripeSubscriptionId: 'sub_test' },
        data: { stripeSubscriptionStatus: 'active' },
      });
    });

    it('should handle customer.subscription.deleted event', async () => {
      const mockEvent = {
        type: 'customer.subscription.deleted',
        data: {
          object: {
            id: 'sub_test_deleted',
          },
        },
      };
      (stripe.webhooks.constructEvent as jest.Mock).mockReturnValue(mockEvent);
      (prisma.client.updateMany as jest.Mock).mockResolvedValue({});

      await service.handleWebhook(Buffer.from('{}'), 'valid_sig');

      expect(prisma.client.updateMany).toHaveBeenCalledWith({
        where: { stripeSubscriptionId: 'sub_test_deleted' },
        data: { stripeSubscriptionStatus: 'canceled' },
      });
    });

    it('should handle payment_intent.succeeded event', async () => {
      const mockEvent = {
        type: 'payment_intent.succeeded',
        data: {
          object: {
            id: 'pi_test',
          },
        },
      };
      (stripe.webhooks.constructEvent as jest.Mock).mockReturnValue(mockEvent);
      const consoleSpy = jest
        .spyOn(console, 'log')
        .mockImplementation(() => { }); // Mock console.log

      await service.handleWebhook(Buffer.from('{}'), 'valid_sig');

      expect(consoleSpy).toHaveBeenCalledWith(
        'PaymentIntent pi_test succeeded.',
      );
      consoleSpy.mockRestore();
    });

    it('should warn for unhandled event types', async () => {
      const mockEvent = {
        type: 'unknown.event',
        data: {
          object: {},
        },
      };
      (stripe.webhooks.constructEvent as jest.Mock).mockReturnValue(mockEvent);
      const consoleWarnSpy = jest
        .spyOn(console, 'warn')
        .mockImplementation(() => { });

      await service.handleWebhook(Buffer.from('{}'), 'valid_sig');

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'Unhandled event type unknown.event',
      );
      consoleWarnSpy.mockRestore();
    });
  });
});
