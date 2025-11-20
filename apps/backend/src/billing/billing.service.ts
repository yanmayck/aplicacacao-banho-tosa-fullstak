import { Injectable, OnModuleInit } from '@nestjs/common';
import Stripe from 'stripe';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BillingService implements OnModuleInit {
  private stripe: Stripe;
  private readonly stripeEnabled: boolean;

  constructor(private prisma: PrismaService) {
    this.stripeEnabled = process.env.STRIPE_BILLING_ENABLED === 'true';
  }

  onModuleInit() {
    if (this.stripeEnabled) {
      this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {});
      console.log('Stripe integration enabled.');
    } else {
      console.log(
        'Stripe integration disabled. Set STRIPE_BILLING_ENABLED=true to enable.',
      );
    }
  }

  async createStripeProduct(name: string, description?: string) {
    if (!this.stripeEnabled) throw new Error('Stripe billing is not enabled.');
    return this.stripe.products.create({
      name,
      description,
      type: 'service',
    });
  }

  async updateStripeProduct(
    productId: string,
    name?: string,
    description?: string,
  ) {
    if (!this.stripeEnabled) throw new Error('Stripe billing is not enabled.');
    return this.stripe.products.update(productId, {
      name,
      description,
    });
  }

  async archiveStripeProduct(productId: string) {
    if (!this.stripeEnabled) throw new Error('Stripe billing is not enabled.');
    return this.stripe.products.update(productId, {
      active: false,
    });
  }

  async createStripePrice(
    productId: string,
    unitAmount: number,
    currency: string = 'brl',
  ) {
    if (!this.stripeEnabled) throw new Error('Stripe billing is not enabled.');
    return this.stripe.prices.create({
      unit_amount: Math.round(unitAmount * 100), // Stripe expects amount in cents
      currency,
      product: productId,
      recurring: { interval: 'month' }, // Assuming packages are monthly for now
    });
  }

  async archiveStripePrice(priceId: string) {
    if (!this.stripeEnabled) throw new Error('Stripe billing is not enabled.');
    return this.stripe.prices.update(priceId, {
      active: false,
    });
  }

  async createCheckoutSession(
    clientId: string, // Nosso client_id interno
    priceId: string,
    quantity: number,
    description: string,
    successUrl: string,
    cancelUrl: string,
  ) {
    if (!this.stripeEnabled) {
      throw new Error('Stripe billing is not enabled.');
    }

    // Buscar ou criar o cliente Stripe
    let stripeCustomerId: string;
    const client: any = await this.prisma.client.findUnique({
      where: { id: clientId },
    });

    if (!client) {
      throw new Error(`Client with ID ${clientId} not found.`);
    }

    if (client.stripeCustomerId) {
      stripeCustomerId = client.stripeCustomerId;
    } else {
      const customer = await this.stripe.customers.create({
        email: client.email || undefined, // Email é opcional no Stripe, mas queremos usar se existir
        name: client.name,
        metadata: {
          our_system_id: clientId,
        },
      });
      stripeCustomerId = customer.id;
      await this.prisma.client.update({
        where: { id: clientId },
        data: { stripeCustomerId: stripeCustomerId },
      });
    }

    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: quantity,
        },
      ],
      mode: 'payment', // Alterado para 'payment' para pacotes de serviço de pagamento único
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer: stripeCustomerId,
      client_reference_id: clientId, // Nosso client_id interno
      metadata: {
        description: description,
      },
    });

    return session;
  }

  async handleWebhook(payload: Buffer, signature: string) {
    if (!this.stripeEnabled) {
      throw new Error('Stripe billing is not enabled.');
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET as string; // Adicionar 'as string'
    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(
        payload,
        signature,
        webhookSecret,
      );
    } catch (err) {
      console.error(
        `Webhook signature verification failed.`,
        (err as Error).message,
      ); // Cast para Error
      throw new Error(`Webhook Error: ${(err as Error).message}`);
    }

    switch (event.type) {
      case 'checkout.session.completed':
        const checkoutSession = event.data.object;
        const clientId = checkoutSession.client_reference_id; // Este é o nosso client_id interno
        const stripeCustomerId = checkoutSession.customer as string;

        if (clientId && stripeCustomerId) {
          await this.prisma.client.update({
            where: { id: clientId },
            data: {
              stripeCustomerId: stripeCustomerId,
            },
          });
          console.log(
            `Client ${clientId} completed checkout. Stripe Customer ID: ${stripeCustomerId}`,
          );
          // TODO: Ativar o pacote de serviços para o cliente
        }
        break;
      case 'invoice.payment_succeeded':
        const invoice = event.data.object;
        const subscriptionIdFromInvoice = (invoice as any).subscription as
          | string
          | undefined;

        if (subscriptionIdFromInvoice) {
          console.log(
            `Invoice payment succeeded for subscription ${subscriptionIdFromInvoice}.`,
          );
        }
        break;
      case 'customer.subscription.updated':
        const subscription = event.data.object;
        const updatedSubscriptionStatus = subscription.status;
        const subscriptionIdUpdated = subscription.id;

        if (subscriptionIdUpdated) {
          await (this.prisma.client as any).updateMany({
            where: { stripeSubscriptionId: subscriptionIdUpdated },
            data: {
              stripeSubscriptionStatus: updatedSubscriptionStatus,
            },
          });
          console.log(
            `Subscription ${subscriptionIdUpdated} updated to status: ${updatedSubscriptionStatus}`,
          );
        }
        break;
      case 'customer.subscription.deleted':
        const deletedSubscription = event.data.object;
        const deletedSubscriptionId = deletedSubscription.id;

        if (deletedSubscriptionId) {
          await (this.prisma.client as any).updateMany({
            where: { stripeSubscriptionId: deletedSubscriptionId },
            data: {
              stripeSubscriptionStatus: 'canceled',
            },
          });
          console.log(`Subscription ${deletedSubscriptionId} canceled.`);
        }
        break;
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        console.log(`PaymentIntent ${paymentIntent.id} succeeded.`);
        break;
      default:
        console.warn(`Unhandled event type ${event.type}`);
    }
  }
}
