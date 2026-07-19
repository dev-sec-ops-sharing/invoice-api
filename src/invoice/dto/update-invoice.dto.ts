import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsString, IsIn } from 'class-validator';
import { CreateInvoiceDto } from './create-invoice.dto';

export class UpdateInvoiceDto extends PartialType(CreateInvoiceDto) {
  @IsOptional()
  @IsString()
  @IsIn(['DRAFT', 'PENDING', 'PAID', 'OVERDUE', 'CANCELLED'])
  status?: string;
}
