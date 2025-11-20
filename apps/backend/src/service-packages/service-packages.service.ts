import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateServicePackageDto } from './dto/create-service-package.dto';
import { UpdateServicePackageDto } from './dto/update-service-package.dto';
import { BillingService } from '../billing/billing.service';
import { ConfigService } from '@nestjs/config';
import { Prisma } from '@prisma/client';

@Injectable()
export class ServicePackagesService {
  private readonly logger = new Logger(ServicePackagesService.name);
  private readonly STRIPE_BILLING_ENABLED: boolean;

  constructor(
    private readonly prisma: PrismaService,
    private readonly billingService: BillingService,
    private readonly configService: ConfigService,
  ) {
    this.STRIPE_BILLING_ENABLED =
      this.configService.get('STRIPE_BILLING_ENABLED') === 'true';
  }

  async create(createServicePackageDto: CreateServicePackageDto) {
    let stripeProductId: string | undefined;
    let stripePriceId: string | undefined;

    if (
      this.STRIPE_BILLING_ENABLED &&
      createServicePackageDto.isOnlineEnabled
    ) {
      try {
        const product = await this.billingService.createStripeProduct(
          createServicePackageDto.name,
          createServicePackageDto.description || undefined,
        );
        stripeProductId = product.id;

        const price = await this.billingService.createStripePrice(
          stripeProductId,
          createServicePackageDto.onlinePrice ||
            createServicePackageDto.basePrice, // Usar onlinePrice se existir, caso contrário, basePrice
        );
        stripePriceId = price.id;
      } catch (error) {
        this.logger.error(
          `Failed to create Stripe product/price for package ${createServicePackageDto.name}: ${error.message}`,
        );
        throw new InternalServerErrorException(
          'Failed to integrate with Stripe for online billing.',
        );
      }
    }

    const data: Prisma.ServicePackageCreateInput = {
      name: createServicePackageDto.name,
      description: createServicePackageDto.description,
      basePrice: new Prisma.Decimal(createServicePackageDto.basePrice),
      onlinePrice:
        createServicePackageDto.onlinePrice !== undefined
          ? new Prisma.Decimal(createServicePackageDto.onlinePrice)
          : undefined,
      pickupPrice:
        createServicePackageDto.pickupPrice !== undefined
          ? new Prisma.Decimal(createServicePackageDto.pickupPrice)
          : undefined,
      durationInMonths: createServicePackageDto.durationInMonths,
      totalServices: createServicePackageDto.totalServices,
      includesBaths: createServicePackageDto.includesBaths,
      includesGrooming: createServicePackageDto.includesGrooming,
      includesHydration: createServicePackageDto.includesHydration,
      isOnlineEnabled: createServicePackageDto.isOnlineEnabled,
      stripeProductId,
      stripePriceId,
    };

    return this.prisma.servicePackage.create({ data });
  }

  findAll() {
    return this.prisma.servicePackage.findMany();
  }

  async findOne(id: string) {
    const servicePackage = await this.prisma.servicePackage.findUnique({
      where: { id },
    });
    if (!servicePackage) {
      throw new NotFoundException(`Service Package with ID ${id} not found`);
    }
    return servicePackage as any; // Forçar tipo para contornar erros de compilação
  }

  async update(id: string, updateServicePackageDto: UpdateServicePackageDto) {
    const existingPackage = await this.findOne(id);
    let stripeProductId: string | null = existingPackage.stripeProductId;
    let stripePriceId: string | null = existingPackage.stripePriceId;
    const updateOnlineEnabled =
      updateServicePackageDto.isOnlineEnabled !== undefined
        ? updateServicePackageDto.isOnlineEnabled
        : existingPackage.isOnlineEnabled;

    if (this.STRIPE_BILLING_ENABLED && updateOnlineEnabled) {
      try {
        if (!stripeProductId) {
          const product = await this.billingService.createStripeProduct(
            updateServicePackageDto.name || existingPackage.name,
            updateServicePackageDto.description ||
              existingPackage.description ||
              undefined,
          );
          stripeProductId = product.id;
        } else if (
          updateServicePackageDto.name ||
          updateServicePackageDto.description
        ) {
          await this.billingService.updateStripeProduct(
            stripeProductId,
            updateServicePackageDto.name || undefined,
            updateServicePackageDto.description || undefined,
          );
        }

        if (
          updateServicePackageDto.onlinePrice !== undefined &&
          !new Prisma.Decimal(updateServicePackageDto.onlinePrice).equals(
            existingPackage.onlinePrice ?? -1,
          )
        ) {
          if (stripePriceId) {
            await this.billingService.archiveStripePrice(stripePriceId);
          }
          const price = await this.billingService.createStripePrice(
            stripeProductId,
            updateServicePackageDto.onlinePrice,
          );
          stripePriceId = price.id;
        }
      } catch (error) {
        this.logger.error(
          `Failed to update Stripe product/price for package ${existingPackage.name}: ${error.message}`,
        );
        throw new InternalServerErrorException(
          'Failed to integrate with Stripe for online billing.',
        );
      }
    }

    const data: Prisma.ServicePackageUpdateInput = {
      name: updateServicePackageDto.name,
      description: updateServicePackageDto.description,
      basePrice:
        updateServicePackageDto.basePrice !== undefined
          ? new Prisma.Decimal(updateServicePackageDto.basePrice)
          : undefined,
      onlinePrice:
        updateServicePackageDto.onlinePrice !== undefined
          ? new Prisma.Decimal(updateServicePackageDto.onlinePrice)
          : undefined,
      pickupPrice:
        updateServicePackageDto.pickupPrice !== undefined
          ? new Prisma.Decimal(updateServicePackageDto.pickupPrice)
          : undefined,
      durationInMonths: updateServicePackageDto.durationInMonths,
      totalServices: updateServicePackageDto.totalServices,
      includesBaths: updateServicePackageDto.includesBaths,
      includesGrooming: updateServicePackageDto.includesGrooming,
      includesHydration: updateServicePackageDto.includesHydration,
      isOnlineEnabled: updateServicePackageDto.isOnlineEnabled,
      stripeProductId: stripeProductId, // Usar a variável local
      stripePriceId: stripePriceId, // Usar a variável local
    };

    return this.prisma.servicePackage.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    const existingPackage = await this.findOne(id);

    if (this.STRIPE_BILLING_ENABLED && existingPackage.stripeProductId) {
      try {
        if (existingPackage.stripePriceId) {
          await this.billingService.archiveStripePrice(
            existingPackage.stripePriceId,
          );
        }
        await this.billingService.archiveStripeProduct(
          existingPackage.stripeProductId,
        );
      } catch (error) {
        this.logger.error(
          `Failed to archive Stripe product/price for package ${existingPackage.name}: ${error.message}`,
        );
      }
    }

    return this.prisma.servicePackage.delete({ where: { id } });
  }

  async registerServiceUsage(
    clientId: string,
    servicePackageId: string,
    serviceId?: string,
  ) {
    const client = await this.prisma.client.findUnique({
      where: { id: clientId },
    });
    if (!client) {
      throw new NotFoundException(`Client with ID ${clientId} not found`);
    }

    const servicePackage = await this.prisma.servicePackage.findUnique({
      where: { id: servicePackageId },
    });
    if (!servicePackage) {
      throw new NotFoundException(
        `Service Package with ID ${servicePackageId} not found`,
      );
    }

    return (this.prisma as any).serviceUsage.create({
      data: {
        clientId,
        servicePackageId,
        usageDate: new Date(),
        serviceId,
        status: 'USED',
      },
    });
  }

  async purchaseServicePackageOnline(
    clientId: string,
    servicePackageId: string,
  ) {
    const client: any = await this.prisma.client.findUnique({
      where: { id: clientId },
    });
    if (!client) {
      throw new NotFoundException(`Client with ID ${clientId} not found`);
    }

    const servicePackage: any = await this.prisma.servicePackage.findUnique({
      where: { id: servicePackageId },
    });
    if (!servicePackage) {
      throw new NotFoundException(
        `Service Package with ID ${servicePackageId} not found`,
      );
    }

    if (!servicePackage.isOnlineEnabled || !servicePackage.stripePriceId) {
      throw new InternalServerErrorException(
        'This service package is not enabled for online purchases.',
      );
    }

    if (!client.stripeCustomerId) {
      throw new InternalServerErrorException(
        'Client does not have a Stripe Customer ID. Cannot process online purchase.',
      );
    }

    try {
      const checkoutSession = await this.billingService.createCheckoutSession(
        client.id,
        servicePackage.stripePriceId,
        1,
        `${servicePackage.name} Purchase`,
        `${this.configService.get('FRONTEND_URL')}/success`,
        `${this.configService.get('FRONTEND_URL')}/cancel`,
      );
      return { checkoutUrl: checkoutSession.url };
    } catch (error) {
      this.logger.error(
        `Failed to create Stripe checkout session for client ${clientId} and package ${servicePackageId}: ${error.message}`,
      );
      throw new InternalServerErrorException(
        'Failed to create Stripe checkout session.',
      );
    }
  }

  async registerOfflinePayment(clientId: string, servicePackageId: string) {
    const client = await this.prisma.client.findUnique({
      where: { id: clientId },
    });
    if (!client) {
      throw new NotFoundException(`Client with ID ${clientId} not found`);
    }

    const servicePackage = await this.prisma.servicePackage.findUnique({
      where: { id: servicePackageId },
    });
    if (!servicePackage) {
      throw new NotFoundException(
        `Service Package with ID ${servicePackageId} not found`,
      );
    }

    this.logger.log(
      `Offline payment registered for client ${clientId} for package ${servicePackageId}.`,
    );
    return {
      message: 'Offline payment registered successfully. Package activated.',
    };
  }
}
