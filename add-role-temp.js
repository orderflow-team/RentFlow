require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const user = await prisma.user.findUnique({ where: { email: 'owner@demo.local' } });
  if (!user) throw new Error('owner@demo.local not found');

  const managerRole = await prisma.role.findUnique({ where: { type: 'MANAGER' } });
  const existing = await prisma.userRole.findFirst({ where: { userId: user.id, roleId: managerRole.id } });
  if (existing) {
    console.log('Already has MANAGER role');
  } else {
    await prisma.userRole.create({ data: { userId: user.id, roleId: managerRole.id, companyId: user.companyId } });
    console.log('Added MANAGER role to owner@demo.local');
  }
}

main().then(() => prisma.$disconnect()).catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
