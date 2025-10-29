import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Multi-Tenant Security Validation (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let companyA: any;
  let companyB: any;
  let companyC: any;
  let userA: any;
  let userB: any;
  let userC: any;
  let clientA: any;
  let clientB: any;
  let petA: any;
  let petB: any;
  let tokenA: string;
  let tokenB: string;
  let tokenC: string;

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

    companyC = await prisma.company.create({
      data: {
        name: 'Empresa C',
        slug: 'empresa-c',
        isActive: true,
      },
    });

    // Criar usuários
    userA = await prisma.user.create({
      data: {
        email: 'userA@test.com',
        password: '$2b$10$hashedpassword',
        name: 'User A',
        role: 'COMPANY_ADMIN',
        companyId: companyA.id,
      },
    });

    userB = await prisma.user.create({
      data: {
        email: 'userB@test.com',
        password: '$2b$10$hashedpassword',
        name: 'User B',
        role: 'COMPANY_ADMIN',
        companyId: companyB.id,
      },
    });

    userC = await prisma.user.create({
      data: {
        email: 'userC@test.com',
        password: '$2b$10$hashedpassword',
        name: 'User C',
        role: 'COMPANY_ADMIN',
        companyId: companyC.id,
      },
    });

    // Criar clientes
    clientA = await prisma.client.create({
      data: {
        name: 'Cliente A',
        email: 'clienteA@test.com',
        phone: '11999999999',
        companyId: companyA.id,
      },
    });

    clientB = await prisma.client.create({
      data: {
        name: 'Cliente B',
        email: 'clienteB@test.com',
        phone: '11888888888',
        companyId: companyB.id,
      },
    });

    // Criar pets
    petA = await prisma.pet.create({
      data: {
        name: 'Pet A',
        species: 'Cachorro',
        breed: 'Poodle',
        clientId: clientA.id,
        companyId: companyA.id,
      },
    });

    petB = await prisma.pet.create({
      data: {
        name: 'Pet B',
        species: 'Gato',
        breed: 'Siamês',
        clientId: clientB.id,
        companyId: companyB.id,
      },
    });

    // Simular tokens JWT
    tokenA = 'mock-jwt-token-companyA';
    tokenB = 'mock-jwt-token-companyB';
    tokenC = 'mock-jwt-token-companyC';
  });

  afterAll(async () => {
    // Limpar dados de teste
    await prisma.pet.deleteMany({
      where: { name: { in: ['Pet A', 'Pet B'] } },
    });
    await prisma.client.deleteMany({
      where: { email: { in: ['clienteA@test.com', 'clienteB@test.com'] } },
    });
    await prisma.user.deleteMany({
      where: {
        email: { in: ['userA@test.com', 'userB@test.com', 'userC@test.com'] },
      },
    });
    await prisma.company.deleteMany({
      where: { slug: { in: ['empresa-a', 'empresa-b', 'empresa-c'] } },
    });
    await app.close();
  });

  describe('Tentativas de Acesso Direto Cross-Tenant', () => {
    it('deve bloquear acesso direto a cliente de outra empresa via ID', () => {
      return request(app.getHttpServer())
        .get(`/clients/${clientB.id}`)
        .set('Authorization', `Bearer ${tokenA}`)
        .expect(403);
    });

    it('deve bloquear acesso direto a pet de outra empresa via ID', () => {
      return request(app.getHttpServer())
        .get(`/pets/${petB.id}`)
        .set('Authorization', `Bearer ${tokenA}`)
        .expect(403);
    });

    it('deve bloquear modificação de cliente de outra empresa', () => {
      return request(app.getHttpServer())
        .put(`/clients/${clientB.id}`)
        .set('Authorization', `Bearer ${tokenA}`)
        .send({ name: 'Cliente B Modificado' })
        .expect(403);
    });

    it('deve bloquear exclusão de pet de outra empresa', () => {
      return request(app.getHttpServer())
        .delete(`/pets/${petB.id}`)
        .set('Authorization', `Bearer ${tokenA}`)
        .expect(403);
    });
  });

  describe('Tentativas de Bypass via Query Parameters', () => {
    it('deve ignorar companyId malicioso nos query params', () => {
      return request(app.getHttpServer())
        .get('/clients?companyId=' + companyB.id)
        .set('Authorization', `Bearer ${tokenA}`)
        .expect(200)
        .expect((res) => {
          // Deve retornar apenas clientes da empresa A, ignorando o companyId malicioso
          res.body.forEach((client: any) => {
            expect(client.companyId).toBe(companyA.id);
          });
        });
    });

    it('deve ignorar companyId malicioso no body', () => {
      return request(app.getHttpServer())
        .post('/clients')
        .set('Authorization', `Bearer ${tokenA}`)
        .send({
          name: 'Cliente Malicioso',
          email: 'malicioso@test.com',
          companyId: companyB.id, // Tentativa de bypass
        })
        .expect(201)
        .expect((res) => {
          // Deve criar o cliente na empresa A, ignorando o companyId malicioso
          expect(res.body.companyId).toBe(companyA.id);
        });
    });
  });

  describe('Tentativas de SQL Injection via Tenant ID', () => {
    it('deve sanitizar tentativas de SQL injection no companyId', () => {
      const maliciousCompanyId = `' OR '1'='1'; --`;
      return request(app.getHttpServer())
        .get('/clients?companyId=' + maliciousCompanyId)
        .set('Authorization', `Bearer ${tokenA}`)
        .expect(200)
        .expect((res) => {
          // Deve retornar apenas clientes da empresa A, não todos os clientes
          res.body.forEach((client: any) => {
            expect(client.companyId).toBe(companyA.id);
          });
        });
    });

    it('deve rejeitar companyId não-UUID', () => {
      return request(app.getHttpServer())
        .get('/clients?companyId=not-a-uuid')
        .set('Authorization', `Bearer ${tokenA}`)
        .expect(400);
    });
  });

  describe('Tentativas de Mass Assignment', () => {
    it('deve prevenir mass assignment de companyId', () => {
      return request(app.getHttpServer())
        .post('/clients')
        .set('Authorization', `Bearer ${tokenA}`)
        .send({
          name: 'Cliente Teste',
          email: 'teste@test.com',
          phone: '11999999999',
          companyId: companyB.id, // Tentativa de mass assignment
          unexpectedField: 'valor inesperado',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.companyId).toBe(companyA.id); // Deve ser da empresa A
          expect(res.body.unexpectedField).toBeUndefined(); // Campo inesperado deve ser ignorado
        });
    });

    it('deve prevenir mass assignment em updates', () => {
      return request(app.getHttpServer())
        .put(`/clients/${clientA.id}`)
        .set('Authorization', `Bearer ${tokenA}`)
        .send({
          name: 'Cliente Atualizado',
          companyId: companyB.id, // Tentativa de mover para outra empresa
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.companyId).toBe(companyA.id); // Deve permanecer na empresa A
        });
    });
  });

  describe('Tentativas de Path Traversal', () => {
    it('deve prevenir path traversal em IDs', () => {
      const maliciousId = '../../../etc/passwd';
      return request(app.getHttpServer())
        .get(`/clients/${maliciousId}`)
        .set('Authorization', `Bearer ${tokenA}`)
        .expect(400);
    });

    it('deve rejeitar IDs com caracteres especiais', () => {
      const maliciousId = 'uuid-with<script>alert("xss")</script>';
      return request(app.getHttpServer())
        .get(`/clients/${maliciousId}`)
        .set('Authorization', `Bearer ${tokenA}`)
        .expect(400);
    });
  });

  describe('Tentativas de Force Browsing', () => {
    it('deve bloquear acesso forçado a endpoints administrativos', () => {
      return request(app.getHttpServer())
        .get('/admin/companies')
        .set('Authorization', `Bearer ${tokenA}`)
        .expect(403);
    });

    it('deve bloquear acesso forçado a dados de sistema', () => {
      return request(app.getHttpServer())
        .get('/system/logs')
        .set('Authorization', `Bearer ${tokenA}`)
        .expect(403);
    });
  });

  describe('Rate Limiting Cross-Tenant', () => {
    it('deve aplicar rate limiting por empresa, não globalmente', async () => {
      // Fazer múltiplas requisições rápidas da Empresa A
      const promises = [];
      for (let i = 0; i < 100; i++) {
        promises.push(
          request(app.getHttpServer())
            .get('/clients')
            .set('Authorization', `Bearer ${tokenA}`),
        );
      }

      const results = await Promise.all(promises);
      const successCount = results.filter((r) => r.status === 200).length;
      const rateLimitedCount = results.filter((r) => r.status === 429).length;

      // Algumas requisições devem ser rate limited
      expect(rateLimitedCount).toBeGreaterThan(0);
      expect(successCount).toBeGreaterThan(0);
    });

    it('rate limiting deve ser independente entre empresas', async () => {
      // Empresa A faz muitas requisições
      const promisesA = [];
      for (let i = 0; i < 50; i++) {
        promisesA.push(
          request(app.getHttpServer())
            .get('/clients')
            .set('Authorization', `Bearer ${tokenA}`),
        );
      }

      // Empresa B faz poucas requisições
      const promisesB = [];
      for (let i = 0; i < 10; i++) {
        promisesB.push(
          request(app.getHttpServer())
            .get('/clients')
            .set('Authorization', `Bearer ${tokenB}`),
        );
      }

      const [resultsA, resultsB] = await Promise.all([
        Promise.all(promisesA),
        Promise.all(promisesB),
      ]);

      const rateLimitedA = resultsA.filter((r) => r.status === 429).length;
      const rateLimitedB = resultsB.filter((r) => r.status === 429).length;

      // Empresa B deve ter menos ou nenhum rate limiting
      expect(rateLimitedB).toBeLessThanOrEqual(rateLimitedA);
    });
  });

  describe('Tentativas de Privilege Escalation', () => {
    it('deve prevenir usuário comum de acessar dados administrativos', () => {
      // Criar usuário comum
      return request(app.getHttpServer())
        .get('/companies')
        .set('Authorization', `Bearer ${tokenA}`) // Mesmo sendo admin, deve ver apenas sua empresa
        .expect(200)
        .expect((res) => {
          expect(res.body.length).toBe(1);
          expect(res.body[0].id).toBe(companyA.id);
        });
    });

    it('deve rejeitar tentativas de modificar role do usuário', () => {
      return request(app.getHttpServer())
        .put(`/users/${userA.id}`)
        .set('Authorization', `Bearer ${tokenA}`)
        .send({
          role: 'SUPER_ADMIN', // Tentativa de escalação
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.role).toBe('COMPANY_ADMIN'); // Deve permanecer o mesmo
        });
    });
  });
});
