# Módulo de Pagamentos Automáticos

## Visão Geral

Este documento detalha a implementação completa do sistema de pagamentos automáticos usando Stripe como gateway de pagamento.

## Funcionalidades

- ✅ Pagamentos com cartão de crédito/débito
- ✅ Suporte a PIX
- ✅ Pagamentos recorrentes (assinaturas)
- ✅ Reembolsos automáticos
- ✅ Webhooks para notificações em tempo real
- ✅ Interface integrada ao sistema financeiro

## Dependências

```json
{
  "dependencies": {
    "stripe": "^12.0.0",
    "@stripe/stripe-js": "^2.0.0",
    "@stripe/react-stripe-js": "^2.0.0"
  }
}
```

## Configuração

### Variáveis de Ambiente

```env
# Stripe Configuration
STRIPE_PUBLISHABLE_KEY=pk_test_51...
STRIPE_SECRET_KEY=sk_test_51...
STRIPE_WEBHOOK_SECRET=whsec_...

# Payment Settings
PAYMENT_CURRENCY=BRL
PAYMENT_WEBHOOK_TOLERANCE=300
```

## Modelo de Dados Detalhado

```prisma
model Payment {
  id            String        @id @default(cuid())
  appointmentId String
  appointment   Appointment   @relation(fields: [appointmentId], references: [id], onDelete: Cascade)

  // Valores
  amount        Float
  currency      String        @default("BRL")
  fee           Float?        // Taxa cobrada pelo gateway
  netAmount     Float?        // Valor líquido (amount - fee)

  // Método e status
  method        PaymentMethod
  status        PaymentStatus @default(PENDING)

  // Stripe IDs
  stripePaymentIntentId String? @unique
  stripeChargeId        String?
  stripeRefundId        String?

  // Dados do Stripe (JSON completo para auditoria)
  stripeData            Json?

  // Controle de tempo
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt
  paidAt        DateTime?
  failedAt      DateTime?
  refundedAt    DateTime?

  // Metadados
  description   String?
  metadata      Json?         // Dados customizados

  // Relacionamentos
  transactions  Transaction[]
  refunds       PaymentRefund[]

  // Índices para performance
  @@index([appointmentId])
  @@index([status])
  @@index([stripePaymentIntentId])
  @@index([createdAt])
}

model PaymentRefund {
  id        String        @id @default(cuid())
  paymentId String
  payment   Payment       @relation(fields: [paymentId], references: [id], onDelete: Cascade)

  amount    Float
  reason    RefundReason
  status    RefundStatus  @default(PENDING)

  // Stripe
  stripeRefundId String? @unique
  stripeData     Json?

  createdAt DateTime @default(now())
  processedAt DateTime?

  @@index([paymentId])
  @@index([status])
}

enum PaymentMethod {
  CREDIT_CARD
  DEBIT_CARD
  PIX
  BOLETO
  CASH
  BANK_TRANSFER
}

enum PaymentStatus {
  PENDING      // Aguardando confirmação
  PROCESSING   // Em processamento
  REQUIRES_ACTION // Requer ação do usuário (3D Secure)
  COMPLETED    // Pago com sucesso
  FAILED       // Falhou
  CANCELLED    // Cancelado
  REFUNDED     // Reembolsado total
  PARTIALLY_REFUNDED // Reembolsado parcialmente
}

enum RefundReason {
  CUSTOMER_REQUEST
  DUPLICATE
  FRAUDULENT
  SERVICE_ISSUE
  OTHER
}

enum RefundStatus {
  PENDING
  PROCESSING
  COMPLETED
  FAILED
}
```

## Serviço de Pagamentos

### Estrutura do Serviço

```typescript
@Injectable()
export class PaymentService {
  constructor(
    private prisma: PrismaService,
    private stripe: Stripe,
    private financialService: FinancialService,
    private hookService: HookService
  ) {}

  // Métodos principais
  async createPaymentIntent(
    data: CreatePaymentIntentDto
  ): Promise<PaymentIntentResponse>;
  async confirmPayment(stripePaymentIntentId: string): Promise<Payment>;
  async failPayment(
    stripePaymentIntentId: string,
    error: any
  ): Promise<Payment>;
  async refundPayment(
    paymentId: string,
    amount: number,
    reason: RefundReason
  ): Promise<PaymentRefund>;
  async getPaymentStatus(paymentId: string): Promise<PaymentStatus>;
  async listPayments(filters: PaymentFilters): Promise<Payment[]>;
}
```

### Criação de Payment Intent

```typescript
async createPaymentIntent(data: CreatePaymentIntentDto): Promise<PaymentIntentResponse> {
  const appointment = await this.prisma.appointment.findUnique({
    where: { id: data.appointmentId },
    include: { client: true, pet: true }
  });

  if (!appointment) {
    throw new NotFoundException('Agendamento não encontrado');
  }

  // Criar registro do pagamento no banco
  const payment = await this.prisma.payment.create({
    data: {
      appointmentId: data.appointmentId,
      amount: data.amount,
      method: data.method,
      description: `Pagamento - ${appointment.pet.name}`,
      metadata: {
        clientName: appointment.client.name,
        petName: appointment.pet.name,
        appointmentDate: appointment.dateTime
      }
    }
  });

  // Criar PaymentIntent no Stripe
  const paymentIntent = await this.stripe.paymentIntents.create({
    amount: Math.round(data.amount * 100), // Stripe trabalha com centavos
    currency: 'brl',
    payment_method_types: this.getPaymentMethodTypes(data.method),
    metadata: {
      paymentId: payment.id,
      appointmentId: data.appointmentId
    },
    description: payment.description,
    receipt_email: appointment.client.email || undefined,
  });

  // Atualizar payment com Stripe ID
  await this.prisma.payment.update({
    where: { id: payment.id },
    data: {
      stripePaymentIntentId: paymentIntent.id,
      stripeData: paymentIntent
    }
  });

  return {
    clientSecret: paymentIntent.client_secret,
    paymentId: payment.id,
    amount: data.amount,
    currency: 'brl'
  };
}
```

## Endpoints da API

### 1. Criar Payment Intent

```typescript
@Post('create-payment-intent')
async createPaymentIntent(@Body() data: CreatePaymentIntentDto) {
  return this.paymentService.createPaymentIntent(data);
}
```

**Request:**

```json
{
  "appointmentId": "clr123abc",
  "amount": 150.5,
  "method": "CREDIT_CARD",
  "metadata": {
    "installments": 1,
    "capture": true
  }
}
```

**Response:**

```json
{
  "clientSecret": "pi_123_secret_456",
  "paymentId": "pay_789",
  "amount": 150.5,
  "currency": "brl",
  "nextAction": null
}
```

### 2. Confirmar Pagamento

```typescript
@Post(':id/confirm')
async confirmPayment(@Param('id') paymentId: string) {
  return this.paymentService.confirmPayment(paymentId);
}
```

### 3. Reembolsar Pagamento

```typescript
@Post(':id/refund')
async refundPayment(
  @Param('id') paymentId: string,
  @Body() data: RefundPaymentDto
) {
  return this.paymentService.refundPayment(paymentId, data.amount, data.reason);
}
```

### 4. Listar Pagamentos

```typescript
@Get()
async listPayments(@Query() filters: PaymentFilters) {
  return this.paymentService.listPayments(filters);
}
```

## Webhooks do Stripe

### Configuração do Endpoint

```typescript
@Post('webhooks/stripe')
async handleStripeWebhook(
  @Body() rawBody: Buffer,
  @Headers('stripe-signature') signature: string,
) {
  const event = this.stripe.webhooks.constructEvent(
    rawBody,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET
  );

  await this.paymentService.handleWebhook(event);
  return { received: true };
}
```

### Tratamento de Eventos

```typescript
async handleWebhook(event: Stripe.Event) {
  switch (event.type) {
    case 'payment_intent.succeeded':
      await this.handlePaymentSucceeded(event.data.object);
      break;
    case 'payment_intent.payment_failed':
      await this.handlePaymentFailed(event.data.object);
      break;
    case 'charge.dispute.created':
      await this.handleDisputeCreated(event.data.object);
      break;
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }
}

private async handlePaymentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  const payment = await this.prisma.payment.findUnique({
    where: { stripePaymentIntentId: paymentIntent.id }
  });

  if (!payment) return;

  // Atualizar status
  await this.prisma.payment.update({
    where: { id: payment.id },
    data: {
      status: PaymentStatus.COMPLETED,
      paidAt: new Date(),
      stripeData: paymentIntent
    }
  });

  // Criar transação financeira
  await this.financialService.createAutomaticIncomeFromAppointment(
    payment.appointmentId
  );

  // Executar hooks
  await this.hookService.executeHook('payment.completed', {
    payment,
    paymentIntent
  });
}
```

## Frontend - Componente de Pagamento

### Configuração do Stripe

```typescript
// PaymentProvider.tsx
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

export const PaymentProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <Elements stripe={stripePromise}>{children}</Elements>;
};
```

### Componente de Formulário de Pagamento

```typescript
// PaymentForm.tsx
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

export const PaymentForm: React.FC<PaymentFormProps> = ({
  amount,
  onSuccess,
  onError,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    setLoading(true);

    try {
      // Criar PaymentIntent no backend
      const { clientSecret } = await api.post(
        "/payments/create-payment-intent",
        {
          appointmentId,
          amount,
          method: "CREDIT_CARD",
        }
      );

      // Confirmar pagamento
      const { error } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (error) {
        onError(error);
      } else {
        onSuccess();
      }
    } catch (error) {
      onError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement
        options={{
          style: {
            base: {
              fontSize: "16px",
              color: "#424770",
              "::placeholder": {
                color: "#aab7c4",
              },
            },
          },
        }}
      />
      <button disabled={!stripe || loading}>
        {loading ? "Processando..." : `Pagar R$ ${amount}`}
      </button>
    </form>
  );
};
```

## Integração com PIX

### Criação de PIX

```typescript
async createPixPayment(data: CreatePixPaymentDto) {
  const paymentIntent = await this.stripe.paymentIntents.create({
    amount: Math.round(data.amount * 100),
    currency: 'brl',
    payment_method_types: ['pix'],
    metadata: {
      paymentId: data.paymentId,
      type: 'pix'
    }
  });

  // O QR Code pode ser obtido através do paymentIntent.next_action.pix_display_qr_code
  return {
    qrCode: paymentIntent.next_action?.pix_display_qr_code?.data,
    expiresAt: paymentIntent.next_action?.pix_display_qr_code?.expires_at
  };
}
```

## Tratamento de Erros

### Tipos de Erro Comuns

```typescript
enum PaymentErrorType {
  CARD_DECLINED = "card_declined",
  INSUFFICIENT_FUNDS = "insufficient_funds",
  EXPIRED_CARD = "expired_card",
  INCORRECT_CVC = "incorrect_cvc",
  PROCESSING_ERROR = "processing_error",
  NETWORK_ERROR = "network_error",
}

class PaymentError extends Error {
  constructor(
    public type: PaymentErrorType,
    public code: string,
    message: string,
    public details?: any
  ) {
    super(message);
  }
}
```

### Tratamento no Frontend

```typescript
const handlePaymentError = (error: StripeError) => {
  let userMessage = "Erro no processamento do pagamento";

  switch (error.type) {
    case "card_error":
      switch (error.code) {
        case "card_declined":
          userMessage = "Cartão recusado. Verifique com seu banco.";
          break;
        case "expired_card":
          userMessage = "Cartão expirado.";
          break;
        case "incorrect_cvc":
          userMessage = "Código de segurança inválido.";
          break;
      }
      break;
    case "validation_error":
      userMessage = "Dados do cartão inválidos.";
      break;
  }

  toast.error(userMessage);
};
```

## Testes

### Testes Unitários

```typescript
describe("PaymentService", () => {
  let service: PaymentService;
  let mockPrisma: MockPrismaClient;
  let mockStripe: MockStripe;

  beforeEach(async () => {
    // Setup mocks
    const module = await Test.createTestingModule({
      providers: [PaymentService],
    }).compile();

    service = module.get<PaymentService>(PaymentService);
  });

  it("should create payment intent successfully", async () => {
    // Test implementation
  });
});
```

### Testes de Integração

```typescript
describe("Payment API (e2e)", () => {
  it("should create and confirm payment", async () => {
    // Criar agendamento de teste
    const appointment = await createTestAppointment();

    // Criar payment intent
    const response = await request(app.getHttpServer())
      .post("/payments/create-payment-intent")
      .send({
        appointmentId: appointment.id,
        amount: 100.0,
        method: "CREDIT_CARD",
      })
      .expect(201);

    expect(response.body).toHaveProperty("clientSecret");
  });
});
```

## Segurança

### Validação de Webhooks

- Verificação de assinatura do Stripe
- Tolerância de timestamp configurável
- Logs de auditoria completos

### Proteção contra Fraude

- Limitação de tentativas de pagamento
- Validação de dados do cartão
- Monitoramento de padrões suspeitos

## Monitoramento e Logs

### Métricas Importantes

- Taxa de conversão de pagamentos
- Tempo médio de processamento
- Taxa de falhas por método
- Valor médio de reembolsos

### Logs Estruturados

```typescript
logger.info("Payment processed", {
  paymentId,
  amount,
  method,
  status,
  processingTime: Date.now() - startTime,
  stripePaymentIntentId,
});
```

## Próximos Passos

1. **Implementação**: Seguir o plano de desenvolvimento
2. **Testes**: Validar todos os fluxos de pagamento
3. **Documentação**: Criar guias para usuários
4. **Monitoramento**: Configurar alertas e dashboards

---

**Última atualização:** Outubro 2025
