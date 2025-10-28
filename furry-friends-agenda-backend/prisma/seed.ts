import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // Obter configurações do ambiente
  const superAdminEmail = process.env.SEED_SUPER_ADMIN_EMAIL || 'superadmin@furryfriends.com';
  const superAdminPassword = process.env.SEED_SUPER_ADMIN_PASSWORD || 'SuperAdmin123!';
  const superAdminName = process.env.SEED_SUPER_ADMIN_NAME || 'Super Administrador';
  const companyName = process.env.SEED_COMPANY_NAME || 'Furry Friends Agenda';
  const companySlug = process.env.SEED_COMPANY_SLUG || 'furry-friends-agenda';
  const companyEmail = process.env.SEED_COMPANY_EMAIL || 'admin@furryfriends.com';
  const companyPhone = process.env.SEED_COMPANY_PHONE || '+55 11 99999-9999';

  // Verificar se já existe um SUPER_ADMIN
  const existingSuperAdmin = await prisma.user.findFirst({
    where: {
      role: UserRole.SUPER_ADMIN,
    },
  });

  if (existingSuperAdmin) {
    console.log('✅ SUPER_ADMIN já existe. Seed já foi executado anteriormente.');
    return;
  }

  // Verificar se já existe uma empresa padrão
  const existingCompany = await prisma.company.findFirst({
    where: {
      name: companyName,
    },
  });

  let companyId: string;

  if (existingCompany) {
    console.log('✅ Empresa padrão já existe.');
    companyId = existingCompany.id;
  } else {
    // Criar empresa padrão
    const company = await prisma.company.create({
      data: {
        name: companyName,
        slug: companySlug,
        description: 'Sistema de agendamento para pet shops e clínicas veterinárias',
        email: companyEmail,
        phone: companyPhone,
        website: 'https://furryfriends.com',
        address: 'São Paulo, SP - Brasil',
        isActive: true,
        settings: {
          timezone: 'America/Sao_Paulo',
          currency: 'BRL',
          language: 'pt-BR',
        },
      },
    });

    console.log('✅ Empresa padrão criada:', company.name);
    companyId = company.id;
  }

  // Criar SUPER_ADMIN
  const hashedPassword = await bcrypt.hash(superAdminPassword, 10);

  const superAdmin = await prisma.user.create({
    data: {
      email: superAdminEmail,
      password: hashedPassword,
      name: superAdminName,
      role: UserRole.SUPER_ADMIN,
      companyId: companyId,
    },
  });

  console.log('✅ SUPER_ADMIN criado com sucesso!');
  console.log('📧 Email:', superAdmin.email);
  console.log('🔑 Senha:', superAdminPassword);
  console.log('⚠️  IMPORTANTE: Altere a senha após o primeiro login!');

  console.log('🎉 Seed concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error('❌ Erro durante o seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });