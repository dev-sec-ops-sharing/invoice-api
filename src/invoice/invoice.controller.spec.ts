import { Test, TestingModule } from '@nestjs/testing';
import { InvoiceController } from './invoice.controller';
import { InvoiceService } from './invoice.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';

describe('InvoiceController', () => {
  let controller: InvoiceController;
  let service: InvoiceService;

  const mockInvoice = {
    id: '1',
    number: 'INV-001',
    customer: 'Test Customer',
    amount: 1000,
    currency: 'USD',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InvoiceController],
      providers: [
        {
          provide: InvoiceService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([mockInvoice]),
            findOne: jest.fn().mockResolvedValue(mockInvoice),
            create: jest.fn().mockResolvedValue(mockInvoice),
            update: jest.fn().mockResolvedValue(mockInvoice),
            remove: jest.fn().mockResolvedValue(mockInvoice),
          },
        },
      ],
    }).compile();

    controller = module.get<InvoiceController>(InvoiceController);
    service = module.get<InvoiceService>(InvoiceService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should find all', async () => {
    const result = await controller.findAll();
    expect(result).toEqual([mockInvoice]);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should find one', async () => {
    const result = await controller.findOne('1');
    expect(result).toEqual(mockInvoice);
    expect(service.findOne).toHaveBeenCalledWith('1');
  });

  it('should create', async () => {
    const dto: CreateInvoiceDto = {
      number: 'INV-001',
      customer: 'Test',
      amount: 100,
      currency: 'USD',
      dueDate: '2026-07-20',
    };
    const result = await controller.create(dto);
    expect(result).toEqual(mockInvoice);
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('should update', async () => {
    const dto: UpdateInvoiceDto = { amount: 200 };
    const result = await controller.update('1', dto);
    expect(result).toEqual(mockInvoice);
    expect(service.update).toHaveBeenCalledWith('1', dto);
  });

  it('should remove', async () => {
    const result = await controller.remove('1');
    expect(result).toEqual(mockInvoice);
    expect(service.remove).toHaveBeenCalledWith('1');
  });
});
