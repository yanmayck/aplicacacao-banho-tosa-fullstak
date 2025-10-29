import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Multi-Tenant Frontend-Backend Integration (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let companyA: any;
  let companyB: any;
  let userA: any;
  let userB: any;
  let clientA: any;
  let petA: any;
  let serviceA: any;
  let tokenA: string;
  let tokenB: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = app.get(PrismaService);
    await app.init();

    // Criar empresas
    companyA = await prisma.company.create({
      data: {
        name: 'PetShop São Paulo',
        slug: 'petshop-sp',
        isActive: true,
        settings: {
          theme: { primaryColor: '#FF6B6B' },
          businessHours: { start: '08:00', end: '18:00' },
        },
      },
    });

    companyB = await prisma.company.create({
      data: {
        name: 'PetShop Rio',
        slug: 'petshop-rj',
        isActive: true,
        settings: {
          theme: { primaryColor: '#3498DB' },
          businessHours: { start: '09:00', end: '19:00' },
        },
      },
    });

    // Criar usuários administradores
    userA = await prisma.user.create({
      data: {
        email: 'admin@petshop-sp.com',
        password: '$2b$10$hashedpassword',
        name: 'Admin São Paulo',
        role: 'COMPANY_ADMIN',
        companyId: companyA.id,
      },
    });

    userB = await prisma.user.create({
      data: {
        email: 'admin@petshop-rj.com',
        password: '$2b$10$hashedpassword',
        name: 'Admin Rio',
        role: 'COMPANY_ADMIN',
        companyId: companyB.id,
      },
    });

    // Criar cliente e pet para empresa A
    clientA = await prisma.client.create({
      data: {
        name: 'João Silva',
        email: 'joao@email.com',
        phone: '11999999999',
        companyId: companyA.id,
      },
    });

    petA = await prisma.pet.create({
      data: {
        name: 'Rex',
        species: 'Cachorro',
        breed: 'Golden Retriever',
        clientId: clientA.id,
        companyId: companyA.id,
      },
    });

    // Criar serviço
    serviceA = await prisma.servicePackage.create({
      data: {
        name: 'Banho Completo',
        description: 'Banho, tosa e hidratação',
        price: 80.0,
        durationMin: 90,
        companyId: companyA.id,
      },
    });

    // Simular tokens JWT
    tokenA = 'mock-jwt-token-companyA';
    tokenB = 'mock-jwt-token-companyB';
  });

  afterAll(async () => {
    // Limpar dados de teste
    await prisma.servicePackage.deleteMany({
      where: { name: 'Banho Completo' },
    });
    await prisma.pet.deleteMany({
      where: { name: 'Rex' },
    });
    await prisma.client.deleteMany({
      where: { email: 'joao@email.com' },
    });
    await prisma.user.deleteMany({
      where: {
        email: { in: ['admin@petshop-sp.com', 'admin@petshop-rj.com'] },
      },
    });
    await prisma.company.deleteMany({
      where: { slug: { in: ['petshop-sp', 'petshop-rj'] } },
    });
    await app.close();
  });

  describe('Dashboard Administrativo', () => {
    it('deve carregar dashboard com dados isolados por empresa', () => {
      return request(app.getHttpServer())
        .get('/dashboard/stats')
        .set('Authorization', `Bearer ${tokenA}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.companyId).toBe(companyA.id);
          expect(res.body.companyName).toBe('PetShop São Paulo');
          expect(res.body.settings.theme.primaryColor).toBe('#FF6B6B');
        });
    });

    it('deve mostrar métricas corretas para cada empresa', () => {
      return request(app.getHttpServer())
        .get('/dashboard/metrics')
        .set('Authorization', `Bearer ${tokenA}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.totalClients).toBeDefined();
          expect(res.body.totalPets).toBeDefined();
          expect(res.body.totalAppointments).toBeDefined();
          // Verificar que as métricas são específicas da empresa A
          expect(res.body.companyId).toBe(companyA.id);
        });
    });
  });

  describe('Gestão de Clientes e Pets', () => {
    it('deve listar clientes com informações completas', () => {
      return request(app.getHttpServer())
        .get('/clients')
        .set('Authorization', `Bearer ${tokenA}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          if (res.body.length > 0) {
            const client = res.body[0];
            expect(client.companyId).toBe(companyA.id);
            expect(client.pets).toBeDefined();
            expect(client.appointments).toBeDefined();
          }
        });
    });

    it('deve permitir CRUD completo de pets', async () => {
      // Criar pet
      const createResponse = await request(app.getHttpServer())
        .post('/pets')
        .set('Authorization', `Bearer ${tokenA}`)
        .send({
          name: 'Bella',
          species: 'Gato',
          breed: 'Persa',
          clientId: clientA.id,
        })
        .expect(201);

      expect(createResponse.body.companyId).toBe(companyA.id);
      expect(createResponse.body.clientId).toBe(clientA.id);

      const petId = createResponse.body.id;

      // Ler pet
      await request(app.getHttpServer())
        .get(`/pets/${petId}`)
        .set('Authorization', `Bearer ${tokenA}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.name).toBe('Bella');
          expect(res.body.companyId).toBe(companyA.id);
        });

      // Atualizar pet
      await request(app.getHttpServer())
        .put(`/pets/${petId}`)
        .set('Authorization', `Bearer ${tokenA}`)
        .send({
          name: 'Bella Updated',
          observations: 'Observação de teste',
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.name).toBe('Bella Updated');
          expect(res.body.companyId).toBe(companyA.id);
        });

      // Deletar pet
      await request(app.getHttpServer())
        .delete(`/pets/${petId}`)
        .set('Authorization', `Bearer ${tokenA}`)
        .expect(200);
    });
  });

  describe('Sistema de Agendamentos', () => {
    it('deve criar agendamento completo', async () => {
      const appointmentData = {
        dateTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Amanhã
        clientId: clientA.id,
        petId: petA.id,
        services: [{ serviceId: serviceA.id, quantity: 1 }],
        notes: 'Agendamento de teste',
      };

      const response = await request(app.getHttpServer())
        .post('/appointments')
        .set('Authorization', `Bearer ${tokenA}`)
        .send(appointmentData)
        .expect(201);

      expect(response.body.companyId).toBe(companyA.id);
      expect(response.body.clientId).toBe(clientA.id);
      expect(response.body.petId).toBe(petA.id);
      expect(response.body.appointmentServices).toBeDefined();
      expect(response.body.appointmentServices.length).toBe(1);

      // Limpar agendamento de teste
      await prisma.appointment.delete({
        where: { id: response.body.id },
      });
    });

    it('deve validar disponibilidade de horários por empresa', () => {
      return request(app.getHttpServer())
        .get('/appointments/availability?date=2024-01-15')
        .set('Authorization', `Bearer ${tokenA}`)
        .expect(200)
        .expect((res) => {
          // Deve considerar apenas os agendamentos da empresa A
          expect(res.body.companyId).toBe(companyA.id);
          expect(res.body.businessHours).toBeDefined();
          expect(res.body.businessHours.start).toBe('08:00');
          expect(res.body.businessHours.end).toBe('18:00');
        });
    });
  });

  describe('Gestão Financeira', () => {
    it('deve registrar transação financeira', () => {
      return request(app.getHttpServer())
        .post('/financial/transactions')
        .set('Authorization', `Bearer ${tokenA}`)
        .send({
          type: 'INCOME',
          amount: 80.0,
          description: 'Pagamento de serviço',
          categoryId: 'service-payment-category-id',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.companyId).toBe(companyA.id);
          expect(res.body.type).toBe('INCOME');
          expect(res.body.amount).toBe(80.0);
        });
    });

    it('deve gerar relatórios financeiros isolados', () => {
      return request(app.getHttpServer())
        .get('/reports/financial?startDate=2024-01-01&endDate=2024-12-31')
        .set('Authorization', `Bearer ${tokenA}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.companyId).toBe(companyA.id);
          expect(res.body.totalIncome).toBeDefined();
          expect(res.body.totalExpenses).toBeDefined();
          expect(res.body.netProfit).toBeDefined();
        });
    });
  });

  describe('Sistema de Notificações', () => {
    it('deve enviar notificação para cliente da empresa', () => {
      return request(app.getHttpServer())
        .post('/notifications')
        .set('Authorization', `Bearer ${tokenA}`)
        .send({
          title: 'Lembrete de Agendamento',
          message: 'Seu pet tem agendamento amanhã',
          type: 'APPOINTMENT_REMINDER',
          clientId: clientA.id,
          channels: ['EMAIL', 'SMS'],
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.companyId).toBe(companyA.id);
          expect(res.body.clientId).toBe(clientA.id);
        });
    });

    it('deve listar notificações apenas da empresa', () => {
      return request(app.getHttpServer())
        .get('/notifications')
        .set('Authorization', `Bearer ${tokenA}`)
        .expect(200)
        .expect((res) => {
          res.body.forEach((notification: any) => {
            expect(notification.companyId).toBe(companyA.id);
          });
        });
    });
  });

  describe('Configurações da Empresa', () => {
    it('deve permitir configurar tema da empresa', () => {
      return request(app.getHttpServer())
        .put(`/companies/${companyA.id}/settings`)
        .set('Authorization', `Bearer ${tokenA}`)
        .send({
          theme: {
            primaryColor: '#FF6B6B',
            secondaryColor: '#4ECDC4',
            logo: 'https://example.com/logo.png',
          },
          businessHours: {
            start: '08:00',
            end: '18:00',
            daysOfWeek: [1, 2, 3, 4, 5, 6], // Segunda a sábado
          },
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.settings.theme.primaryColor).toBe('#FF6B6B');
          expect(res.body.settings.businessHours.start).toBe('08:00');
        });
    });

    it('deve isolar configurações entre empresas', () => {
      // Verificar que empresa B tem configurações diferentes
      return request(app.getHttpServer())
        .get(`/companies/${companyB.id}/settings`)
        .set('Authorization', `Bearer ${tokenB}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.settings.theme.primaryColor).toBe('#3498DB');
          expect(res.body.settings.businessHours.start).toBe('09:00');
        });
    });
  });

  describe('Portal Público', () => {
    beforeAll(async () => {
      // Habilitar portal público para empresa A
      await prisma.publicPortal.create({
        data: {
          companyId: companyA.id,
          isEnabled: true,
          features: { services: true, appointments: true, reviews: true },
        },
      });
    });

    it('deve servir portal público da empresa via subdomínio', () => {
      return request(app.getHttpServer())
        .get('/public')
        .set('Host', 'petshop-sp.furryfriends.com')
        .expect(200)
        .expect((res) => {
          expect(res.body.company.name).toBe('PetShop São Paulo');
          expect(res.body.publicPortal.isEnabled).toBe(true);
        });
    });

    it('deve permitir agendamento público', () => {
      return request(app.getHttpServer())
        .post('/public/appointments')
        .set('Host', 'petshop-sp.furryfriends.com')
        .send({
          clientName: 'Maria Santos',
          clientPhone: '11888888888',
          clientEmail: 'maria@email.com',
          petName: 'Luna',
          petSpecies: 'Gato',
          serviceId: serviceA.id,
          dateTime: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.companyId).toBe(companyA.id);
        });
    });
  });

  describe('API Cross-Tenant Isolation', () => {
    it('frontend deve receber apenas dados da empresa correta', () => {
      // Simular chamada do frontend com token da empresa A
      return request(app.getHttpServer())
        .get('/api/v1/dashboard')
        .set('Authorization', `Bearer ${tokenA}`)
        .set('X-Company-Context', companyA.id)
        .expect(200)
        .expect((res) => {
          expect(res.body.company.id).toBe(companyA.id);
          expect(res.body.company.name).toBe('PetShop São Paulo');

          // Verificar que não há dados de outras empresas
          if (res.body.clients) {
            res.body.clients.forEach((client: any) => {
              expect(client.companyId).toBe(companyA.id);
            });
          }

          if (res.body.pets) {
            res.body.pets.forEach((pet: any) => {
              expect(pet.companyId).toBe(companyA.id);
            });
          }
        });
    });

    it('deve rejeitar tentativas de acessar dados de outra empresa', () => {
      return request(app.getHttpServer())
        .get('/api/v1/clients')
        .set('Authorization', `Bearer ${tokenA}`)
        .set('X-Company-Context', companyB.id) // Tentativa de acessar empresa B
        .expect(403);
    });
  });
});
