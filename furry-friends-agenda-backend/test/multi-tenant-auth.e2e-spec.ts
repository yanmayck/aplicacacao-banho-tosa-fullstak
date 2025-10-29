import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Multi-Tenant Authentication (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let companyA: any;
  let companyB: any;
  let userA: any;
  let userB: any;
  let tokenA: string;
  let tokenB: string;

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
      },
    });

    companyB = await prisma.company.create({
      data: {
        name: 'Empresa B',
        slug: 'empresa-b',
        isActive: true,
      },
    });

    // Criar usuários para cada empresa
    userA = await prisma.user.create({
      data: {
        email: 'userA@test.com',
        password: '$2b$10$hashedpassword', // senha hashada
        name: 'User A',
        role: 'COMPANY_ADMIN',
        companyId: companyA.id,
      },
    });

    userB = await prisma.user.create({
      data: {
        email: 'userB@test.com',
        password: '$2b$10$hashedpassword', // senha hashada
        name: 'User B',
        role: 'COMPANY_ADMIN',
        companyId: companyB.id,
      },
    });

    // Simular tokens JWT (em produção, seria gerado pelo auth service)
    tokenA = 'mock-jwt-token-companyA';
    tokenB = 'mock-jwt-token-companyB';
  });

  afterAll(async () => {
    // Limpar dados de teste
    await prisma.user.deleteMany({
      where: { email: { in: ['userA@test.com', 'userB@test.com'] } },
    });
    await prisma.company.deleteMany({
      where: { slug: { in: ['empresa-a', 'empresa-b'] } },
    });
    await app.close();
  });

  describe('Autenticação por Empresa', () => {
    it('deve permitir login de usuário da Empresa A', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'userA@test.com',
          password: 'password123',
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.access_token).toBeDefined();
          expect(res.body.user.companyId).toBe(companyA.id);
        });
    });

    it('deve permitir login de usuário da Empresa B', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'userB@test.com',
          password: 'password123',
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.access_token).toBeDefined();
          expect(res.body.user.companyId).toBe(companyB.id);
        });
    });

    it('deve rejeitar login com credenciais inválidas', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'invalid@test.com',
          password: 'wrongpassword',
        })
        .expect(401);
    });
  });

  describe('Isolamento de Sessão', () => {
    it('usuário da Empresa A não deve acessar dados da Empresa B', () => {
      return request(app.getHttpServer())
        .get('/clients')
        .set('Authorization', `Bearer ${tokenA}`)
        .expect(200)
        .expect((res) => {
          // Verificar que apenas clientes da empresa A são retornados
          res.body.forEach((client: any) => {
            expect(client.companyId).toBe(companyA.id);
          });
        });
    });

    it('usuário da Empresa B não deve acessar dados da Empresa A', () => {
      return request(app.getHttpServer())
        .get('/clients')
        .set('Authorization', `Bearer ${tokenB}`)
        .expect(200)
        .expect((res) => {
          // Verificar que apenas clientes da empresa B são retornados
          res.body.forEach((client: any) => {
            expect(client.companyId).toBe(companyB.id);
          });
        });
    });
  });

  describe('Tentativas de Acesso Cross-Tenant', () => {
    it('deve bloquear tentativa de acesso direto a dados de outra empresa', () => {
      return request(app.getHttpServer())
        .get(`/clients?companyId=${companyB.id}`)
        .set('Authorization', `Bearer ${tokenA}`)
        .expect(403);
    });

    it('deve bloquear modificação de dados de outra empresa', () => {
      return request(app.getHttpServer())
        .post('/clients')
        .set('Authorization', `Bearer ${tokenA}`)
        .send({
          name: 'Cliente Teste',
          companyId: companyB.id, // Tentando criar para empresa B
        })
        .expect(403);
    });
  });
});
