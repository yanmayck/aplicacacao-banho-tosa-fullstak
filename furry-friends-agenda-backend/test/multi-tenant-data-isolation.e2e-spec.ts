import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Multi-Tenant Data Isolation (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let companyA: any;
  let companyB: any;
  let userA: any;
  let userB: any;
  let clientA: any;
  let clientB: any;
  let petA: any;
  let petB: any;
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
      where: { email: { in: ['userA@test.com', 'userB@test.com'] } },
    });
    await prisma.company.deleteMany({
      where: { slug: { in: ['empresa-a', 'empresa-b'] } },
    });
    await app.close();
  });

  describe('Isolamento de Clientes', () => {
    it('usuário da Empresa A deve ver apenas seus clientes', () => {
      return request(app.getHttpServer())
        .get('/clients')
        .set('Authorization', `Bearer ${tokenA}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.length).toBeGreaterThan(0);
          res.body.forEach((client: any) => {
            expect(client.companyId).toBe(companyA.id);
            expect(client.name).toBe('Cliente A');
          });
        });
    });

    it('usuário da Empresa B deve ver apenas seus clientes', () => {
      return request(app.getHttpServer())
        .get('/clients')
        .set('Authorization', `Bearer ${tokenB}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.length).toBeGreaterThan(0);
          res.body.forEach((client: any) => {
            expect(client.companyId).toBe(companyB.id);
            expect(client.name).toBe('Cliente B');
          });
        });
    });

    it('deve bloquear acesso a cliente de outra empresa', () => {
      return request(app.getHttpServer())
        .get(`/clients/${clientB.id}`)
        .set('Authorization', `Bearer ${tokenA}`)
        .expect(403);
    });
  });

  describe('Isolamento de Pets', () => {
    it('usuário da Empresa A deve ver apenas pets de sua empresa', () => {
      return request(app.getHttpServer())
        .get('/pets')
        .set('Authorization', `Bearer ${tokenA}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.length).toBeGreaterThan(0);
          res.body.forEach((pet: any) => {
            expect(pet.companyId).toBe(companyA.id);
            expect(pet.name).toBe('Pet A');
          });
        });
    });

    it('usuário da Empresa B deve ver apenas pets de sua empresa', () => {
      return request(app.getHttpServer())
        .get('/pets')
        .set('Authorization', `Bearer ${tokenB}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.length).toBeGreaterThan(0);
          res.body.forEach((pet: any) => {
            expect(pet.companyId).toBe(companyB.id);
            expect(pet.name).toBe('Pet B');
          });
        });
    });

    it('deve bloquear acesso a pet de outra empresa', () => {
      return request(app.getHttpServer())
        .get(`/pets/${petB.id}`)
        .set('Authorization', `Bearer ${tokenA}`)
        .expect(403);
    });
  });

  describe('Isolamento de Agendamentos', () => {
    let appointmentA: any;
    let appointmentB: any;

    beforeAll(async () => {
      // Criar agendamentos para teste
      appointmentA = await prisma.appointment.create({
        data: {
          dateTime: new Date(),
          status: 'SCHEDULED',
          totalPrice: 50.0,
          clientId: clientA.id,
          petId: petA.id,
          companyId: companyA.id,
        },
      });

      appointmentB = await prisma.appointment.create({
        data: {
          dateTime: new Date(),
          status: 'SCHEDULED',
          totalPrice: 60.0,
          clientId: clientB.id,
          petId: petB.id,
          companyId: companyB.id,
        },
      });
    });

    afterAll(async () => {
      await prisma.appointment.deleteMany({
        where: { id: { in: [appointmentA.id, appointmentB.id] } },
      });
    });

    it('usuário da Empresa A deve ver apenas agendamentos de sua empresa', () => {
      return request(app.getHttpServer())
        .get('/appointments')
        .set('Authorization', `Bearer ${tokenA}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.length).toBeGreaterThan(0);
          res.body.forEach((appointment: any) => {
            expect(appointment.companyId).toBe(companyA.id);
          });
        });
    });

    it('deve bloquear acesso a agendamento de outra empresa', () => {
      return request(app.getHttpServer())
        .get(`/appointments/${appointmentB.id}`)
        .set('Authorization', `Bearer ${tokenA}`)
        .expect(403);
    });
  });

  describe('Tentativas de Violação de Isolamento', () => {
    it('deve impedir criação de cliente para outra empresa', () => {
      return request(app.getHttpServer())
        .post('/clients')
        .set('Authorization', `Bearer ${tokenA}`)
        .send({
          name: 'Cliente Inválido',
          email: 'invalido@test.com',
          companyId: companyB.id, // Tentando criar para empresa B
        })
        .expect(403);
    });

    it('deve impedir criação de pet para cliente de outra empresa', () => {
      return request(app.getHttpServer())
        .post('/pets')
        .set('Authorization', `Bearer ${tokenA}`)
        .send({
          name: 'Pet Inválido',
          species: 'Cachorro',
          clientId: clientB.id, // Cliente de outra empresa
          companyId: companyA.id,
        })
        .expect(403);
    });
  });
});
