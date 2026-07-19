import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.transaction.deleteMany({});
  await prisma.invoice.deleteMany({});

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
      {
        number: 'INV-2024-004',
        customer: 'GHI Technology',
        amount: 12000000,
        currency: 'VND',
        status: 'DRAFT',
        dueDate: new Date('2024-04-10'),
        description: 'Cloud Infrastructure Setup',
      },
    ],
  });

  // Seed transactions
  await prisma.transaction.createMany({
    data: [
      {
        userId: 'usr_1',
        senderId: 'usr_1',
        receiverId: 'usr_2',
        amount: 500000,
      },
      {
        userId: 'usr_2',
        senderId: 'usr_2',
        receiverId: 'usr_3',
        amount: 250000,
      },
      {
        userId: 'usr_1',
        senderId: 'usr_3',
        receiverId: 'usr_1',
        amount: 120000,
      },
      {
        userId: 'usr_2',
        senderId: 'usr_2',
        receiverId: 'usr_1',
        amount: 750000,
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
