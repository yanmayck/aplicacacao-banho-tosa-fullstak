import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { Prisma, Service } from '@prisma/client'; // Importar Prisma e Service
import { BillingService } from '../billing/billing.service'; // Importar BillingService
import { ConfigService } from '@nestjs/config'; // Importar ConfigService

type ServiceWithStripeFields = Service & {
  stripePriceId: string | null;
  stripeProductId: string | null;
};

@Injectable()
export class ServicesService {
  private readonly logger = new Logger(ServicesService.name);
  private readonly STRIPE_BILLING_ENABLED: boolean;

  constructor(
    private prisma: PrismaService,
    private readonly billingService: BillingService, // Injetar BillingService
    private readonly configService: ConfigService, // Injetar ConfigService
  ) {
    this.STRIPE_BILLING_ENABLED =
      this.configService.get('STRIPE_BILLING_ENABLED') === 'true';
  }

  async create(createServiceDto: CreateServiceDto) {
    let stripeProductId: string | undefined;
    let stripePriceId: string | undefined;

    if (this.STRIPE_BILLING_ENABLED && createServiceDto.isOnlineEnabled) {
      try {
        const product = await this.billingService.createStripeProduct(
          createServiceDto.name,
          createServiceDto.description || undefined,
        );
        stripeProductId = product.id;

        const price = await this.billingService.createStripePrice(
          stripeProductId,
          createServiceDto.price,
        );
        stripePriceId = price.id;
      } catch (error: any) {
        this.logger.error(
          `Failed to create Stripe product/price for service ${createServiceDto.name}: ${error.message}`,
        );
        throw new InternalServerErrorException(
          'Failed to integrate with Stripe for online billing.',
        );
      }
    }

    try {
      const data: Prisma.ServiceCreateInput = {
        ...createServiceDto,
        stripeProductId,
        stripePriceId,
      };
      return await this.prisma.service.create({ data });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002' // Unique constraint violation
      ) {
        throw new ConflictException(
          `Service with name "${createServiceDto.name}" already exists.`,
        );
      }
      throw error;
    }
  }

  async findAll() {
    return this.prisma.service.findMany() as Promise<ServiceWithStripeFields[]>;
  }

  async findOne(id: string) {
    const service = await this.prisma.service.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        durationMin: true,
        isOnlineEnabled: true,
        stripePriceId: true,
        stripeProductId: true,
      },
    });
    if (!service) {
      throw new NotFoundException(`Service with ID "${id}" not found`);
    }
    return service as ServiceWithStripeFields;
  }

  async update(id: string, updateServiceDto: UpdateServiceDto): Promise<any> {
    const existingService = await this.findOne(id);
    let stripeProductId: string | undefined =
      existingService?.stripeProductId || undefined;
    let stripePriceId: string | undefined =
      existingService?.stripePriceId || undefined;

    if (
      this.STRIPE_BILLING_ENABLED &&
      (updateServiceDto.isOnlineEnabled !== undefined
        ? updateServiceDto.isOnlineEnabled
        : existingService?.isOnlineEnabled)
    ) {
      try {
        if (!stripeProductId) {
          const product = await this.billingService.createStripeProduct(
            updateServiceDto.name || existingService.name,
            updateServiceDto.description ||
              existingService.description ||
              undefined,
          );
          stripeProductId = product.id;
        } else if (updateServiceDto.name || updateServiceDto.description) {
          await this.billingService.updateStripeProduct(
            stripeProductId,
            updateServiceDto.name || undefined,
            updateServiceDto.description || undefined,
          );
        }

        if (
          updateServiceDto.price !== undefined &&
          updateServiceDto.price !== existingService.price
        ) {
          // Archive old price and create new one
          if (stripePriceId) {
            await this.billingService.archiveStripePrice(stripePriceId);
          }
          const price = await this.billingService.createStripePrice(
            stripeProductId,
            updateServiceDto.price,
          );
          stripePriceId = price.id;
        }
      } catch (error: any) {
        this.logger.error(
          `Failed to update Stripe product/price for service ${existingService.name}: ${error.message}`,
        );
        throw new InternalServerErrorException(
          'Failed to integrate with Stripe for online billing.',
        );
      }
    }

    try {
      const data: Prisma.ServiceUpdateInput = {
        ...updateServiceDto,
        stripeProductId,
        stripePriceId,
      };
      return await this.prisma.service.update({
        where: { id },
        data,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          // Record to update not found.
          throw new NotFoundException(`Service with ID "${id}" not found`);
        }
        if (error.code === 'P2002') {
          // Unique constraint violation
          throw new ConflictException(
            `Service with name "${updateServiceDto.name}" already exists.`,
          );
        }
      }
      throw error;
    }
  }

  async remove(id: string): Promise<any> {
    const existingService = await this.findOne(id);

    if (this.STRIPE_BILLING_ENABLED && existingService?.stripeProductId) {
      try {
        // Archive product and price in Stripe
        if (existingService?.stripePriceId) {
          await this.billingService.archiveStripePrice(
            existingService.stripePriceId,
          );
        }
        await this.billingService.archiveStripeProduct(
          existingService.stripeProductId,
        );
      } catch (error: any) {
        this.logger.error(
          `Failed to archive Stripe product/price for service ${existingService.name}: ${error.message}`,
        );
        // Decide if you want to throw or just log and proceed with deletion in your DB
      }
    }

    try {
      return await this.prisma.service.delete({
        where: { id },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025' // Record to delete not found.
      ) {
        throw new NotFoundException(`Service with ID "${id}" not found`);
      }
      throw error;
    }
  }

  async purchaseOnline(clientId: string, serviceId: string) {
    const client = await this.prisma.client.findUnique({
      where: { id: clientId },
      select: {
        id: true,
        name: true,
        email: true,
        stripeCustomerId: true,
      },
    });

    if (!client) {
      throw new NotFoundException(`Client with ID ${clientId} not found`);
    }

    const service = await this.prisma.service.findUnique({
      where: { id: serviceId },
      select: {
        id: true,
        name: true,
        price: true,
        isOnlineEnabled: true,
        stripePriceId: true,
      },
    });

    if (!service) {
      throw new NotFoundException(`Service with ID ${serviceId} not found`);
    }

    if (!service.isOnlineEnabled || !service.stripePriceId) {
      throw new InternalServerErrorException(
        'This service is not enabled for online purchases.',
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
        service.stripePriceId,
        1,
        `${service.name} Purchase`,
        `${this.configService.get('FRONTEND_URL')}/success`,
        `${this.configService.get('FRONTEND_URL')}/cancel`,
      );
      return { checkoutUrl: checkoutSession.url };
    } catch (error: any) {
      this.logger.error(
        `Failed to create Stripe checkout session for client ${clientId} and service ${serviceId}: ${error.message}`,
      );
      throw new InternalServerErrorException(
        'Failed to create Stripe checkout session.',
      );
    }
  }

  async registerOfflinePayment(clientId: string, serviceId: string) {
    const client = await this.prisma.client.findUnique({
      where: { id: clientId },
    });
    if (!client) {
      throw new NotFoundException(`Client with ID ${clientId} not found`);
    }

    const service = await this.prisma.service.findUnique({
      where: { id: serviceId },
    });
    if (!service) {
      throw new NotFoundException(`Service with ID ${serviceId} not found`);
    }

    this.logger.log(
      `Offline payment registered for client ${clientId} for service ${serviceId}.`,
    );
    // TODO: Implement actual financial transaction recording
  }
}
