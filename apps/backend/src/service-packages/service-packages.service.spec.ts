import { Test, TestingModule } from '@nestjs/testing';
import { ServicePackagesService } from './service-packages.service';
import { PrismaService } from '../prisma/prisma.service';
import { BillingService } from '../billing/billing.service';
import { ConfigService } from '@nestjs/config';
import {
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Prisma, ServicePackage } from '@prisma/client';

describe('ServicePackagesService', () => {
  let service: ServicePackagesService;
  let prisma: jest.Mocked<PrismaService>;
  let billingService: jest.Mocked<BillingService>;
  let configService: jest.Mocked<ConfigService>;

  const mockServicePackage: ServicePackage = {
    id: 'pkg1',
    name: 'Basic Package',
    description: 'Basic grooming package',
    basePrice: new Prisma.Decimal(50.0),
    onlinePrice: new Prisma.Decimal(55.0),
    pickupPrice: new Prisma.Decimal(60.0),
    durationInMonths: 1,
    totalServices: 1,
    includesBaths: true,
    includesGrooming: false,
    includesHydration: false,
    isOnlineEnabled: true,
    stripeProductId: 'prod_test',
    stripePriceId: 'price_test',
    createdAt: new Date(),
    updatedAt: new Date(),
    serviceId: null,
  };

  const mockClient: any = {
    id: 'client1',
    name: 'Test Client',
    email: 'test@example.com',
    stripeCustomerId: 'cus_temp',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ServicePackagesService,
        {
          provide: PrismaService,
          useValue: {
            servicePackage: {
              create: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
            client: {
              findUnique: jest.fn(),
            },
            serviceUsage: {
              create: jest.fn(),
            },
          },
        },
        {
          provide: BillingService,
          useValue: {
            createStripeProduct: jest.fn(),
            updateStripeProduct: jest.fn(),
            archiveStripeProduct: jest.fn(),
            createStripePrice: jest.fn(),
            archiveStripePrice: jest.fn(),
            createCheckoutSession: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'STRIPE_BILLING_ENABLED') return 'true';
              if (key === 'FRONTEND_URL') return 'http://localhost:3000';
              return null;
            }),
          },
        },
      ],
    }).compile();

    service = module.get<ServicePackagesService>(ServicePackagesService);
    prisma = module.get(PrismaService);
    billingService = module.get(BillingService);
    configService = module.get(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createDto = {
      name: 'New Package',
      description: 'A new service package',
      basePrice: 100,
      onlinePrice: 110,
      pickupPrice: 120,
      durationInMonths: 1,
      totalServices: 2,
      includesBaths: true,
      includesGrooming: true,
      includesHydration: false,
      isOnlineEnabled: true,
    };

    it('should create a service package and interact with Stripe', async () => {
      billingService.createStripeProduct.mockResolvedValue({
        id: 'prod_new',
      } as any);
      billingService.createStripePrice.mockResolvedValue({
        id: 'price_new',
      } as any);
      (prisma.servicePackage.create as jest.Mock).mockResolvedValue({
        ...mockServicePackage,
        ...createDto,
        id: 'new_pkg',
        stripeProductId: 'prod_new',
        stripePriceId: 'price_new',
      });

      const result = await service.create(createDto);

      expect(billingService.createStripeProduct).toHaveBeenCalledWith(
        createDto.name,
        createDto.description,
      );
      expect(billingService.createStripePrice).toHaveBeenCalledWith(
        'prod_new',
        createDto.onlinePrice,
      );
      expect(prisma.servicePackage.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          stripeProductId: 'prod_new',
          stripePriceId: 'price_new',
        }),
      });
      expect(result.stripeProductId).toBe('prod_new');
    });
  });

  describe('update', () => {
    const updateDto = {
      name: 'Updated Package',
      onlinePrice: 60,
    };

    it('should update a service package and Stripe prices', async () => {
      (prisma.servicePackage.findUnique as jest.Mock).mockResolvedValue(
        mockServicePackage,
      );
      billingService.createStripePrice.mockResolvedValue({
        id: 'price_updated',
      } as any);
      (prisma.servicePackage.update as jest.Mock).mockResolvedValue({
        ...mockServicePackage,
        ...updateDto,
        stripePriceId: 'price_updated',
      });

      const result = await service.update('pkg1', updateDto);

      expect(billingService.archiveStripePrice).toHaveBeenCalledWith(
        'price_test',
      );
      expect(billingService.createStripePrice).toHaveBeenCalledWith(
        'prod_test',
        updateDto.onlinePrice,
      );
      expect(prisma.servicePackage.update).toHaveBeenCalledWith({
        where: { id: 'pkg1' },
        data: expect.objectContaining({
          stripePriceId: 'price_updated',
        }),
      });
      expect(result.stripePriceId).toBe('price_updated');
    });
  });

  describe('remove', () => {
    it('should remove a service package and archive Stripe product', async () => {
      (prisma.servicePackage.findUnique as jest.Mock).mockResolvedValue(
        mockServicePackage,
      );

      await service.remove('pkg1');

      expect(billingService.archiveStripeProduct).toHaveBeenCalledWith(
        'prod_test',
      );
      expect(prisma.servicePackage.delete).toHaveBeenCalledWith({
        where: { id: 'pkg1' },
      });
    });
  });

  describe('purchaseServicePackageOnline', () => {
    it('should create a checkout session', async () => {
      (prisma.client.findUnique as jest.Mock).mockResolvedValue(mockClient);
      (prisma.servicePackage.findUnique as jest.Mock).mockResolvedValue(
        mockServicePackage,
      );
      billingService.createCheckoutSession.mockResolvedValue({
        url: 'http://checkout.url',
      } as any);

      const result = await service.purchaseServicePackageOnline(
        'client1',
        'pkg1',
      );

      expect(billingService.createCheckoutSession).toHaveBeenCalled();
      expect(result).toEqual({ checkoutUrl: 'http://checkout.url' });
    });
  });
});
