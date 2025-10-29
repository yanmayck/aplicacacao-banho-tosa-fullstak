import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Iniciando migração e seed de dados para teste completo...');

  // Verificar se já existe dados
  const existingCompanies = await prisma.company.count();
  if (existingCompanies > 0) {
    console.log('✅ Dados já existem. Pulando migração...');
    return;
  }

  // 1. Criar empresas de teste
  console.log('🏢 Criando empresas de teste...');

  const company1 = await prisma.company.create({
    data: {
      name: 'PetShop Furry Friends',
      slug: 'petshop-furry-friends',
      description: 'Pet shop completo com serviços de banho e tosa',
      email: 'contato@petshopfurry.com',
      phone: '+55 11 99999-0001',
      address: 'Rua das Flores, 123 - São Paulo, SP',
      isActive: true,
      settings: {
        timezone: 'America/Sao_Paulo',
        currency: 'BRL',
        language: 'pt-BR',
        businessHours: {
          monday: { open: '08:00', close: '18:00' },
          tuesday: { open: '08:00', close: '18:00' },
          wednesday: { open: '08:00', close: '18:00' },
          thursday: { open: '08:00', close: '18:00' },
          friday: { open: '08:00', close: '18:00' },
          saturday: { open: '08:00', close: '16:00' },
          sunday: { closed: true }
        }
      }
    }
  });

  const company2 = await prisma.company.create({
    data: {
      name: 'Clínica Vet Amigos',
      slug: 'clinica-vet-amigos',
      description: 'Clínica veterinária especializada em pets',
      email: 'contato@clinicavetamigos.com',
      phone: '+55 11 99999-0002',
      address: 'Av. Paulista, 456 - São Paulo, SP',
      isActive: true,
      settings: {
        timezone: 'America/Sao_Paulo',
        currency: 'BRL',
        language: 'pt-BR'
      }
    }
  });

  console.log('✅ Empresas criadas:', company1.name, 'e', company2.name);

  // 2. Criar usuários administrativos
  console.log('👥 Criando usuários administrativos...');

  const hashedPassword = await bcrypt.hash('Teste123!', 10);

  const admin1 = await prisma.user.create({
    data: {
      email: 'admin@petshopfurry.com',
      password: hashedPassword,
      name: 'João Silva',
      role: UserRole.COMPANY_ADMIN,
      companyId: company1.id
    }
  });

  const admin2 = await prisma.user.create({
    data: {
      email: 'admin@clinicavetamigos.com',
      password: hashedPassword,
      name: 'Maria Santos',
      role: UserRole.COMPANY_ADMIN,
      companyId: company2.id
    }
  });

  const superAdmin = await prisma.user.create({
    data: {
      email: 'superadmin@furryfriends.com',
      password: await bcrypt.hash('SuperAdmin123!', 10),
      name: 'Super Administrador',
      role: UserRole.SUPER_ADMIN,
      companyId: company1.id
    }
  });

  console.log('✅ Usuários criados');

  // 3. Criar funcionários
  const employee1 = await prisma.user.create({
    data: {
      email: 'funcionario1@petshopfurry.com',
      password: hashedPassword,
      name: 'Ana Costa',
      role: UserRole.EMPLOYEE,
      companyId: company1.id
    }
  });

  const groomer1 = await prisma.user.create({
    data: {
      email: 'tosador@petshopfurry.com',
      password: hashedPassword,
      name: 'Carlos Oliveira',
      role: UserRole.GROOMER,
      companyId: company1.id
    }
  });

  // 4. Criar tosadores
  const groomerData1 = await prisma.groomer.create({
    data: {
      name: 'Carlos Oliveira',
      email: 'tosador@petshopfurry.com',
      phone: '+55 11 99999-1001',
      specialties: ['Banho', 'Tosa', 'Hidratação'],
      status: 'available',
      commissionPercentage: 20,
      companyId: company1.id
    }
  });

  const groomerData2 = await prisma.groomer.create({
    data: {
      name: 'Fernanda Lima',
      email: 'tosadora@petshopfurry.com',
      phone: '+55 11 99999-1002',
      specialties: ['Banho', 'Tosa Higiênica'],
      status: 'available',
      commissionPercentage: 18,
      companyId: company1.id
    }
  });

  console.log('✅ Funcionários e tosadores criados');

  // 5. Criar serviços
  console.log('💇 Criando serviços...');

  const service1 = await prisma.servicePackage.create({
    data: {
      name: 'Banho Completo',
      description: 'Banho com shampoo premium e secagem',
      price: 45.00,
      durationMin: 60,
      companyId: company1.id
    }
  });

  const service2 = await prisma.servicePackage.create({
    data: {
      name: 'Tosa Completa',
      description: 'Tosa higiênica + banho + hidratação',
      price: 80.00,
      durationMin: 90,
      companyId: company1.id
    }
  });

  const service3 = await prisma.servicePackage.create({
    data: {
      name: 'Consulta Veterinária',
      description: 'Consulta completa com exame físico',
      price: 120.00,
      durationMin: 30,
      companyId: company2.id
    }
  });

  console.log('✅ Serviços criados');

  // 6. Criar pacotes
  const package1 = await prisma.package.create({
    data: {
      name: 'Pacote Premium',
      description: '5 banhos + 2 tosas',
      includesBaths: 5,
      includesGrooming: true,
      includesHydration: true,
      basePrice: 350.00,
      pickupPrice: 400.00,
      companyId: company1.id
    }
  });

  console.log('✅ Pacotes criados');

  // 7. Criar categorias de produtos
  console.log('📦 Criando categorias de produtos...');

  const category1 = await prisma.productCategory.create({
    data: {
      name: 'Shampoos',
      description: 'Produtos para banho',
      isActive: true,
      companyId: company1.id
    }
  });

  const category2 = await prisma.productCategory.create({
    data: {
      name: 'Medicamentos',
      description: 'Produtos veterinários',
      isActive: true,
      companyId: company2.id
    }
  });

  // 8. Criar produtos
  const product1 = await prisma.product.create({
    data: {
      name: 'Shampoo Premium para Cães',
      description: 'Shampoo hipoalergênico',
      sku: 'SHAMP001',
      purchasePrice: 15.00,
      salePrice: 25.00,
      currentStock: 50,
      minStock: 10,
      type: 'SHAMPOO',
      unitOfMeasure: 'UNIT',
      categoryId: category1.id,
      companyId: company1.id
    }
  });

  const product2 = await prisma.product.create({
    data: {
      name: 'Antipulgas Bravecto',
      description: 'Medicamento veterinário',
      sku: 'MED001',
      purchasePrice: 45.00,
      salePrice: 75.00,
      currentStock: 20,
      minStock: 5,
      type: 'MEDICINE',
      unitOfMeasure: 'UNIT',
      categoryId: category2.id,
      companyId: company2.id
    }
  });

  console.log('✅ Produtos criados');

  // 9. Criar clientes
  console.log('👨‍👩‍👧‍👦 Criando clientes...');

  const client1 = await prisma.client.create({
    data: {
      name: 'Roberto Almeida',
      phone: '+55 11 99999-2001',
      email: 'roberto@email.com',
      address: 'Rua dos Pinheiros, 789 - São Paulo, SP',
      companyId: company1.id
    }
  });

  const client2 = await prisma.client.create({
    data: {
      name: 'Carla Fernandes',
      phone: '+55 11 99999-2002',
      email: 'carla@email.com',
      address: 'Av. Brigadeiro, 321 - São Paulo, SP',
      companyId: company2.id
    }
  });

  console.log('✅ Clientes criados');

  // 10. Criar pets
  const pet1 = await prisma.pet.create({
    data: {
      name: 'Rex',
      species: 'Cachorro',
      breed: 'Golden Retriever',
      birthDate: '2020-05-15',
      foodType: 'Ração premium',
      clientId: client1.id,
      companyId: company1.id,
      observations: 'Alergia a shampoo comum'
    }
  });

  const pet2 = await prisma.pet.create({
    data: {
      name: 'Mia',
      species: 'Gato',
      breed: 'Siamês',
      birthDate: '2019-08-20',
      clientId: client2.id,
      companyId: company2.id
    }
  });

  console.log('✅ Pets criados');

  // 11. Criar agendamentos
  console.log('📅 Criando agendamentos...');

  const appointment1 = await prisma.appointment.create({
    data: {
      dateTime: new Date('2025-11-01T10:00:00Z'),
      status: 'SCHEDULED',
      notes: 'Primeiro banho do Rex',
      totalPrice: 45.00,
      clientId: client1.id,
      petId: pet1.id,
      groomerId: groomerData1.id,
      companyId: company1.id,
      appointmentServices: {
        create: {
          serviceId: service1.id,
          priceAtTime: 45.00,
          quantity: 1
        }
      }
    }
  });

  const appointment2 = await prisma.appointment.create({
    data: {
      dateTime: new Date('2025-11-02T14:00:00Z'),
      status: 'CONFIRMED',
      notes: 'Consulta de rotina',
      totalPrice: 120.00,
      clientId: client2.id,
      petId: pet2.id,
      companyId: company2.id,
      appointmentServices: {
        create: {
          serviceId: service3.id,
          priceAtTime: 120.00,
          quantity: 1
        }
      }
    }
  });

  console.log('✅ Agendamentos criados');

  // 12. Criar categorias financeiras
  console.log('💰 Criando categorias financeiras...');

  const incomeCategory1 = await prisma.financialCategory.create({
    data: {
      name: 'Serviços de Banho e Tosa',
      type: 'INCOME',
      isActive: true
    }
  });

  const expenseCategory1 = await prisma.financialCategory.create({
    data: {
      name: 'Produtos de Consumo',
      type: 'EXPENSE',
      isActive: true
    }
  });

  // 13. Criar transações
  const transaction1 = await prisma.transaction.create({
    data: {
      type: 'INCOME',
      amount: 45.00,
      description: 'Pagamento - Banho Completo para Rex',
      date: new Date('2025-11-01T10:00:00Z'),
      categoryId: incomeCategory1.id,
      appointmentId: appointment1.id,
      paymentMethod: 'Dinheiro',
      companyId: company1.id
    }
  });

  const transaction2 = await prisma.transaction.create({
    data: {
      type: 'EXPENSE',
      amount: 15.00,
      description: 'Compra de shampoo premium',
      date: new Date('2025-10-25T09:00:00Z'),
      categoryId: expenseCategory1.id,
      paymentMethod: 'Cartão',
      companyId: company1.id
    }
  });

  console.log('✅ Transações criadas');

  // 14. Criar templates de notificação
  console.log('📧 Criando templates de notificação...');

  const template1 = await prisma.notificationTemplate.create({
    data: {
      name: 'Lembrete de Agendamento',
      title: 'Lembrete: Agendamento amanhã',
      content: 'Olá {{clientName}}! Lembramos que você tem um agendamento marcado para amanhã às {{appointmentTime}} para o serviço de {{serviceName}} com o pet {{petName}}.',
      type: 'APPOINTMENT_REMINDER',
      channel: 'EMAIL',
      isActive: true,
      variables: ['clientName', 'appointmentTime', 'serviceName', 'petName'],
      companyId: company1.id
    }
  });

  console.log('✅ Templates de notificação criados');

  console.log('🎉 Migração e seed concluídos com sucesso!');
  console.log('');
  console.log('📊 RESUMO DOS DADOS CRIADOS:');
  console.log('🏢 Empresas:', 2);
  console.log('👥 Usuários:', 5);
  console.log('💇 Tosadores:', 2);
  console.log('💇 Serviços:', 3);
  console.log('📦 Pacotes:', 1);
  console.log('📦 Produtos:', 2);
  console.log('👨‍👩‍👧‍👦 Clientes:', 2);
  console.log('🐾 Pets:', 2);
  console.log('📅 Agendamentos:', 2);
  console.log('💰 Transações:', 2);
  console.log('📧 Templates:', 1);
  console.log('');
  console.log('🔐 CREDENCIAIS DE TESTE:');
  console.log('Super Admin: superadmin@furryfriends.com / SuperAdmin123!');
  console.log('Admin PetShop: admin@petshopfurry.com / Teste123!');
  console.log('Admin Clínica: admin@clinicavetamigos.com / Teste123!');
  console.log('Funcionário: funcionario1@petshopfurry.com / Teste123!');
  console.log('Tosador: tosador@petshopfurry.com / Teste123!');
}

main()
  .catch((e) => {
    console.error('❌ Erro durante a migração:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });