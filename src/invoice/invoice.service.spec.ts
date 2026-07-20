import { Test, TestingModule } from '@nestjs/testing';
import { InvoiceService } from './invoice.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';

describe('InvoiceService', () => {
  let service: InvoiceService;
  let prisma: PrismaService;

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
  } as any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InvoiceService,
        {
          provide: PrismaService,
          useValue: {
            invoice: {
              findMany: jest.fn(),
              findUnique: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<InvoiceService>(InvoiceService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should cover DTO classes', () => {
    const createDto = new CreateInvoiceDto();
    const updateDto = new UpdateInvoiceDto();
    expect(createDto).toBeDefined();
    expect(updateDto).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all invoices', async () => {
      jest.spyOn(prisma.invoice, 'findMany').mockResolvedValue([mockInvoice]);
      const result = await service.findAll();
      expect(result).toEqual([mockInvoice]);
    });
  });

  describe('findOne', () => {
    it('should return an invoice if found', async () => {
      jest.spyOn(prisma.invoice, 'findUnique').mockResolvedValue(mockInvoice);
      const result = await service.findOne('1');
      expect(result).toEqual(mockInvoice);
    });

    it('should throw NotFoundException if not found', async () => {
      jest.spyOn(prisma.invoice, 'findUnique').mockResolvedValue(null);
      await expect(service.findOne('99')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a new invoice', async () => {
      jest.spyOn(prisma.invoice, 'create').mockResolvedValue(mockInvoice);
      const dto: CreateInvoiceDto = {
        number: 'INV-001',
        customer: 'Test Customer',
        amount: 1000,
        currency: 'USD',
        dueDate: '2026-07-20',
        description: 'Test',
      };
      const result = await service.create(dto);
      expect(result).toEqual(mockInvoice);
    });
  });

  describe('update', () => {
    it('should update an invoice', async () => {
      jest.spyOn(prisma.invoice, 'findUnique').mockResolvedValue(mockInvoice);
      jest.spyOn(prisma.invoice, 'update').mockResolvedValue(mockInvoice);
      const dto: UpdateInvoiceDto = {
        amount: 2000,
        dueDate: '2026-07-25',
      };
      const result = await service.update('1', dto);
      expect(result).toEqual(mockInvoice);
    });

    it('should update an invoice without dueDate', async () => {
      jest.spyOn(prisma.invoice, 'findUnique').mockResolvedValue(mockInvoice);
      jest.spyOn(prisma.invoice, 'update').mockResolvedValue(mockInvoice);
      const dto: UpdateInvoiceDto = {
        amount: 2000,
      };
      const result = await service.update('1', dto);
      expect(result).toEqual(mockInvoice);
    });
  });

  describe('remove', () => {
    it('should remove an invoice', async () => {
      jest.spyOn(prisma.invoice, 'findUnique').mockResolvedValue(mockInvoice);
      jest.spyOn(prisma.invoice, 'delete').mockResolvedValue(mockInvoice);
      const result = await service.remove('1');
      expect(result).toEqual(mockInvoice);
    });
  });
});
