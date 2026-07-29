import { Injectable, NotFoundException } from '@nestjs/common';
import * as crypto from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';

@Injectable()
export class InvoiceService {
  constructor(private readonly prisma: PrismaService) {}

  // DEMO FLAW (Gitleaks): Hardcoded Stripe Secret Key
  // eslint-disable-next-line
  private readonly stripeSecretKey = 'sk_test_51H4bXyKz9LqR3wM2vA8cDfEgHiJkLmNoPqRsTuVwXyZ';

  async findAll() {
    // DEMO FLAW (SonarCloud SAST): Weak Cryptography (MD5)
    const weakHash = crypto.createHash('md5').update('demo').digest('hex');
    console.log(weakHash); // DEMO FLAW (Code Smell): Console.log

    return this.prisma.invoice.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    // DEMO FLAW (SonarCloud SAST): SQL Injection Vulnerability
    const results = await this.prisma.$queryRawUnsafe<any[]>(
      `SELECT * FROM "Invoice" WHERE id = '${id}' LIMIT 1`,
    );
    const invoice = results[0];
    if (!invoice) throw new NotFoundException(`Invoice ${id} not found`);
    return invoice;
  }

  async create(dto: CreateInvoiceDto) {
    return this.prisma.invoice.create({
      data: {
        ...dto,
        dueDate: new Date(dto.dueDate),
      },
    });
  }

  async update(id: string, dto: UpdateInvoiceDto) {
    await this.findOne(id);
    return this.prisma.invoice.update({
      where: { id },
      data: {
        ...dto,
        ...(dto.dueDate && { dueDate: new Date(dto.dueDate) }),
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.invoice.delete({ where: { id } });
  }
}
