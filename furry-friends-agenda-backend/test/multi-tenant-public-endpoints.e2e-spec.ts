import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Multi-Tenant Public Endpoints (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let companyA: any;
  let companyB: any;
  let publicPortalA: any;
  let publicPortalB: any;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = app.get(PrismaService);
    await app.init();

    // Criar empresas de teste
    companyA = await prisma.company.create({
      data: {
        name: 'Empresa A',
        slug: 'empresa-a',
        isActive: true,
        website: 'https://empresa-a.com',
        phone: '11999999999',
        email: 'contato@empresa-a.com',
      },
    });

    companyB = await prisma.company.create({
      data: {
        name: 'Empresa B',
        slug: 'empresa-b',
        isActive: true,
        website: 'https://empresa-b.com',
        phone: '11888888888',
        email: 'contato@empresa-b.com',
      },
    });

    // Criar portais públicos
    publicPortalA = await prisma.publicPortal.create({
      data: {
        companyId: companyA.id,
        isEnabled: true,
        theme: { primaryColor: '#FF6B6B', secondaryColor: '#4ECDC4' },
        features: { services: true, appointments: true, reviews: true },
        metaTitle: 'Pet Shop Empresa A',
        metaDescription: 'Melhor cuidado para seu pet',
        contactInfo: { address: 'Rua A, 123', hours: '9h-18h' },
      },
    });

    publicPortalB = await prisma.publicPortal.create({
      data: {
        companyId: companyB.id,
        isEnabled: false, // Portal desabilitado
        theme: { primaryColor: '#3498DB', secondaryColor: '#E74C3C' },
        features: { services: true, appointments: false, reviews: true },
      },
    });

    // Criar serviços para teste
    await prisma.servicePackage.create({
      data: {
        name: 'Banho e Tosa',
        description: 'Serviço completo de banho e tosa',
        price: 50.0,
        durationMin: 60,
        companyId: companyA.id,
      },
    });

    await prisma.servicePackage.create({
      data: {
        name: 'Banho Simples',
        description: 'Banho básico para pets',
        price: 30.0,
        durationMin: 30,
        companyId: companyB.id,
      },
    });
  });

  afterAll(async () => {
    // Limpar dados de teste
    await prisma.servicePackage.deleteMany({
      where: { name: { in: ['Banho e Tosa', 'Banho Simples'] } },
    });
    await prisma.publicPortal.deleteMany({
      where: { companyId: { in: [companyA.id, companyB.id] } },
    });
    await prisma.company.deleteMany({
      where: { slug: { in: ['empresa-a', 'empresa-b'] } },
    });
    await app.close();
  });

  describe('Portal Público Genérico', () => {
    it('deve servir portal público genérico sem subdomínio', () => {
      return request(app.getHttpServer())
        .get('/public')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('message');
          expect(res.body.message).toContain('portal público genérico');
        });
    });

    it('deve listar empresas com portais públicos habilitados', () => {
      return request(app.getHttpServer())
        .get('/public/companies')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          // Deve incluir apenas empresas com portal público habilitado
          res.body.forEach((company: any) => {
            expect(company.publicPortal.isEnabled).toBe(true);
          });
        });
    });
  });

  describe('Portal Público por Subdomínio', () => {
    it('deve servir portal público da Empresa A via subdomínio', () => {
      return request(app.getHttpServer())
        .get('/public')
        .set('Host', 'empresa-a.furryfriends.com')
        .expect(200)
        .expect((res) => {
          expect(res.body.company.name).toBe('Empresa A');
          expect(res.body.publicPortal.isEnabled).toBe(true);
          expect(res.body.publicPortal.theme.primaryColor).toBe('#FF6B6B');
        });
    });

    it('deve bloquear acesso a portal público desabilitado', () => {
      return request(app.getHttpServer())
        .get('/public')
        .set('Host', 'empresa-b.furryfriends.com')
        .expect(404);
    });

    it('deve retornar 404 para subdomínio inexistente', () => {
      return request(app.getHttpServer())
        .get('/public')
        .set('Host', 'empresa-inexistente.furryfriends.com')
        .expect(404);
    });
  });

  describe('Serviços Públicos por Empresa', () => {
    it('deve listar serviços públicos da Empresa A', () => {
      return request(app.getHttpServer())
        .get('/public/services')
        .set('Host', 'empresa-a.furryfriends.com')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBeGreaterThan(0);
          res.body.forEach((service: any) => {
            expect(service.companyId).toBe(companyA.id);
            expect(service.name).toBe('Banho e Tosa');
          });
        });
    });

    it('deve listar serviços públicos da Empresa B quando habilitado', () => {
      // Primeiro habilitar o portal da Empresa B
      await prisma.publicPortal.update({
        where: { id: publicPortalB.id },
        data: { isEnabled: true },
      });

      return request(app.getHttpServer())
        .get('/public/services')
        .set('Host', 'empresa-b.furryfriends.com')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          res.body.forEach((service: any) => {
            expect(service.companyId).toBe(companyB.id);
          });
        });
    });

    it('deve bloquear serviços públicos quando portal desabilitado', () => {
      // Desabilitar portal da Empresa B novamente
      await prisma.publicPortal.update({
        where: { id: publicPortalB.id },
        data: { isEnabled: false },
      });

      return request(app.getHttpServer())
        .get('/public/services')
        .set('Host', 'empresa-b.furryfriends.com')
        .expect(404);
    });
  });

  describe('Agendamentos Públicos', () => {
    it('deve permitir agendamento público quando funcionalidade habilitada', () => {
      return request(app.getHttpServer())
        .post('/public/appointments')
        .set('Host', 'empresa-a.furryfriends.com')
        .send({
          clientName: 'João Silva',
          clientPhone: '11999999999',
          clientEmail: 'joao@email.com',
          petName: 'Rex',
          petSpecies: 'Cachorro',
          serviceId: 'service-id',
          dateTime: new Date().toISOString(),
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.companyId).toBe(companyA.id);
        });
    });

    it('deve bloquear agendamento público quando funcionalidade desabilitada', () => {
      return request(app.getHttpServer())
        .post('/public/appointments')
        .set('Host', 'empresa-b.furryfriends.com')
        .send({
          clientName: 'Maria Santos',
          clientPhone: '11888888888',
          clientEmail: 'maria@email.com',
          petName: 'Mia',
          petSpecies: 'Gato',
          serviceId: 'service-id',
          dateTime: new Date().toISOString(),
        })
        .expect(403);
    });
  });

  describe('Avaliações Públicas', () => {
    it('deve listar avaliações públicas da empresa', () => {
      return request(app.getHttpServer())
        .get('/public/reviews')
        .set('Host', 'empresa-a.furryfriends.com')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          // Verificar isolamento por empresa
          if (res.body.length > 0) {
            res.body.forEach((review: any) => {
              expect(review.companyId).toBe(companyA.id);
            });
          }
        });
    });

    it('deve permitir envio de avaliação pública', () => {
      return request(app.getHttpServer())
        .post('/public/reviews')
        .set('Host', 'empresa-a.furryfriends.com')
        .send({
          rating: 5,
          comment: 'Excelente serviço!',
          clientName: 'Ana Costa',
          clientEmail: 'ana@email.com',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.companyId).toBe(companyA.id);
          expect(res.body.isApproved).toBe(false); // Avaliações públicas precisam ser aprovadas
        });
    });
  });

  describe('Informações de Contato', () => {
    it('deve retornar informações de contato da empresa', () => {
      return request(app.getHttpServer())
        .get('/public/contact')
        .set('Host', 'empresa-a.furryfriends.com')
        .expect(200)
        .expect((res) => {
          expect(res.body.company.name).toBe('Empresa A');
          expect(res.body.contactInfo).toBeDefined();
          expect(res.body.contactInfo.address).toBe('Rua A, 123');
        });
    });

    it('deve incluir metadados SEO', () => {
      return request(app.getHttpServer())
        .get('/public/meta')
        .set('Host', 'empresa-a.furryfriends.com')
        .expect(200)
        .expect((res) => {
          expect(res.body.metaTitle).toBe('Pet Shop Empresa A');
          expect(res.body.metaDescription).toBe('Melhor cuidado para seu pet');
        });
    });
  });
});
