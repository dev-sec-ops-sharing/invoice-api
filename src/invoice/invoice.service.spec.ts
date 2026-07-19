import { Test, TestingModule } from '@nestjs/testing';
import { InvoiceService } from './invoice.service';
import { PrismaService } from '../prisma/prisma.service';

describe('InvoiceService', () => {
  let service: InvoiceService;

  const mockInvoice = {
    id: '1',
    number: 'INV-001',
    customer: 'Test Customer',
    amount: 1000,
    currency: 'USD',
    status: 'DRAFT',
    dueDate: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    description: 'Test invoice description',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InvoiceService,
        {
          provide: PrismaService,
          useValue: {
            invoice: {
              findMany: jest.fn().mockResolvedValue([mockInvoice]),
              findUnique: jest.fn().mockResolvedValue(mockInvoice),
              create: jest.fn().mockResolvedValue(mockInvoice),
              update: jest.fn().mockResolvedValue(mockInvoice),
              delete: jest.fn().mockResolvedValue(mockInvoice),
            },
          },
        },
      ],
    }).compile();

    service = module.get<InvoiceService>(InvoiceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all invoices', async () => {
    const result = await service.findAll();
    expect(result).toEqual([mockInvoice]);
  });
});
