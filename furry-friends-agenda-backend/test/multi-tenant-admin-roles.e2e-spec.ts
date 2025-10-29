import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Multi-Tenant Admin Roles (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let companyA: any;
  let companyB: any;
  let superAdmin: any;
  let companyAdminA: any;
  let companyAdminB: any;
  let managerA: any;
  let employeeA: any;
  let groomerA: any;
  let tokenSuperAdmin: string;
  let tokenCompanyAdminA: string;
  let tokenCompanyAdminB: string;
  let tokenManagerA: string;
  let tokenEmployeeA: string;
  let tokenGroomerA: string;

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

    // Criar usuários com diferentes roles
    superAdmin = await prisma.user.create({
      data: {
        email: 'superadmin@test.com',
        password: '$2b$10$hashedpassword',
        name: 'Super Admin',
        role: 'SUPER_ADMIN',
        companyId: companyA.id, // Super admin pode estar em qualquer empresa
      },
    });

    companyAdminA = await prisma.user.create({
      data: {
        email: 'adminA@test.com',
        password: '$2b$10$hashedpassword',
        name: 'Admin A',
        role: 'COMPANY_ADMIN',
        companyId: companyA.id,
      },
    });

    companyAdminB = await prisma.user.create({
      data: {
        email: 'adminB@test.com',
        password: '$2b$10$hashedpassword',
        name: 'Admin B',
        role: 'COMPANY_ADMIN',
        companyId: companyB.id,
      },
    });

    managerA = await prisma.user.create({
      data: {
        email: 'managerA@test.com',
        password: '$2b$10$hashedpassword',
        name: 'Manager A',
        role: 'MANAGER',
        companyId: companyA.id,
      },
    });

    employeeA = await prisma.user.create({
      data: {
        email: 'employeeA@test.com',
        password: '$2b$10$hashedpassword',
        name: 'Employee A',
        role: 'EMPLOYEE',
        companyId: companyA.id,
      },
    });

    groomerA = await prisma.user.create({
      data: {
        email: 'groomerA@test.com',
        password: '$2b$10$hashedpassword',
        name: 'Groomer A',
        role: 'GROOMER',
        companyId: companyA.id,
      },
    });

    // Simular tokens JWT
    tokenSuperAdmin = 'mock-jwt-super-admin';
    tokenCompanyAdminA = 'mock-jwt-company-admin-a';
    tokenCompanyAdminB = 'mock-jwt-company-admin-b';
    tokenManagerA = 'mock-jwt-manager-a';
    tokenEmployeeA = 'mock-jwt-employee-a';
    tokenGroomerA = 'mock-jwt-groomer-a';
  });

  afterAll(async () => {
    // Limpar dados de teste
    await prisma.user.deleteMany({
      where: {
        email: {
          in: [
            'superadmin@test.com',
            'adminA@test.com',
            'adminB@test.com',
            'managerA@test.com',
            'employeeA@test.com',
            'groomerA@test.com',
          ],
        },
      },
    });
    await prisma.company.deleteMany({
      where: { slug: { in: ['empresa-a', 'empresa-b'] } },
    });
    await app.close();
  });

  describe('SUPER_ADMIN Permissions', () => {
    it('SUPER_ADMIN deve acessar dados de todas as empresas', () => {
      return request(app.getHttpServer())
        .get('/companies')
        .set('Authorization', `Bearer ${tokenSuperAdmin}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.length).toBeGreaterThanOrEqual(2);
          const companyNames = res.body.map((c: any) => c.name);
          expect(companyNames).toContain('Empresa A');
          expect(companyNames).toContain('Empresa B');
        });
    });

    it('SUPER_ADMIN deve criar novas empresas', () => {
      return request(app.getHttpServer())
        .post('/companies')
        .set('Authorization', `Bearer ${tokenSuperAdmin}`)
        .send({
          name: 'Nova Empresa',
          slug: 'nova-empresa',
        })
        .expect(201);
    });

    it('SUPER_ADMIN deve gerenciar usuários de qualquer empresa', () => {
      return request(app.getHttpServer())
        .get('/users')
        .set('Authorization', `Bearer ${tokenSuperAdmin}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.length).toBeGreaterThan(0);
        });
    });
  });

  describe('COMPANY_ADMIN Permissions', () => {
    it('COMPANY_ADMIN deve gerenciar apenas sua própria empresa', () => {
      return request(app.getHttpServer())
        .get('/companies')
        .set('Authorization', `Bearer ${tokenCompanyAdminA}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.length).toBe(1);
          expect(res.body[0].id).toBe(companyA.id);
        });
    });

    it('COMPANY_ADMIN deve criar usuários para sua empresa', () => {
      return request(app.getHttpServer())
        .post('/users')
        .set('Authorization', `Bearer ${tokenCompanyAdminA}`)
        .send({
          email: 'novousuario@empresaA.com',
          password: 'password123',
          name: 'Novo Usuário',
          role: 'EMPLOYEE',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.companyId).toBe(companyA.id);
        });
    });

    it('COMPANY_ADMIN não deve acessar dados de outra empresa', () => {
      return request(app.getHttpServer())
        .get(`/companies/${companyB.id}`)
        .set('Authorization', `Bearer ${tokenCompanyAdminA}`)
        .expect(403);
    });
  });

  describe('MANAGER Permissions', () => {
    it('MANAGER deve acessar relatórios e analytics', () => {
      return request(app.getHttpServer())
        .get('/reports/financial')
        .set('Authorization', `Bearer ${tokenManagerA}`)
        .expect(200);
    });

    it('MANAGER deve gerenciar agendamentos', () => {
      return request(app.getHttpServer())
        .get('/appointments')
        .set('Authorization', `Bearer ${tokenManagerA}`)
        .expect(200);
    });

    it('MANAGER não deve criar usuários', () => {
      return request(app.getHttpServer())
        .post('/users')
        .set('Authorization', `Bearer ${tokenManagerA}`)
        .send({
          email: 'tentativa@empresaA.com',
          password: 'password123',
          name: 'Tentativa',
          role: 'EMPLOYEE',
        })
        .expect(403);
    });
  });

  describe('EMPLOYEE Permissions', () => {
    it('EMPLOYEE deve ter acesso básico de leitura', () => {
      return request(app.getHttpServer())
        .get('/clients')
        .set('Authorization', `Bearer ${tokenEmployeeA}`)
        .expect(200);
    });

    it('EMPLOYEE não deve criar clientes', () => {
      return request(app.getHttpServer())
        .post('/clients')
        .set('Authorization', `Bearer ${tokenEmployeeA}`)
        .send({
          name: 'Cliente Teste',
          email: 'teste@cliente.com',
        })
        .expect(403);
    });
  });

  describe('GROOMER Permissions', () => {
    it('GROOMER deve ver apenas seus agendamentos', () => {
      return request(app.getHttpServer())
        .get('/appointments?groomerId=' + groomerA.id)
        .set('Authorization', `Bearer ${tokenGroomerA}`)
        .expect(200);
    });

    it('GROOMER deve atualizar status de serviços', () => {
      // Assumindo que existe um agendamento para este groomer
      return request(app.getHttpServer())
        .patch('/appointments/1/status')
        .set('Authorization', `Bearer ${tokenGroomerA}`)
        .send({ status: 'IN_PROGRESS' })
        .expect(200);
    });

    it('GROOMER não deve acessar dados financeiros', () => {
      return request(app.getHttpServer())
        .get('/financial/transactions')
        .set('Authorization', `Bearer ${tokenGroomerA}`)
        .expect(403);
    });
  });

  describe('Cross-Company Access Prevention', () => {
    it('COMPANY_ADMIN A não deve modificar empresa B', () => {
      return request(app.getHttpServer())
        .put(`/companies/${companyB.id}`)
        .set('Authorization', `Bearer ${tokenCompanyAdminA}`)
        .send({ name: 'Empresa B Modificada' })
        .expect(403);
    });

    it('MANAGER A não deve ver dados da empresa B', () => {
      return request(app.getHttpServer())
        .get('/clients')
        .set('Authorization', `Bearer ${tokenManagerA}`)
        .set('X-Company-Id', companyB.id)
        .expect(403);
    });
  });
});
