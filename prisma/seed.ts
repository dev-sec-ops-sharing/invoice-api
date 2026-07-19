import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.invoice.createMany({
    data: [
      {
        number: 'INV-2024-001',
        customer: 'ABC Corporation',
        amount: 15000000,
        currency: 'VND',
        status: 'PAID',
        dueDate: new Date('2024-02-15'),
        description: 'Software development services for Jan 2024',
      },
      {
        number: 'INV-2024-002',
        customer: 'XYZ Joint Stock Company',
        amount: 8500000,
        currency: 'VND',
        status: 'PENDING',
        dueDate: new Date('2024-03-01'),
        description: 'System maintenance for Feb 2024',
      },
      {
        number: 'INV-2024-003',
        customer: 'DEF Startup',
        amount: 25000000,
        currency: 'VND',
        status: 'OVERDUE',
        dueDate: new Date('2024-01-30'),
        description: 'UI/UX Design for mobile application',
      },
    ],
  });
  console.log('✅ Seed data created');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
