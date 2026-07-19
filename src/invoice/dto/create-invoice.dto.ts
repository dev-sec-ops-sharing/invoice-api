import {
  IsString,
  IsNumber,
  IsOptional,
  IsDateString,
  Min,
} from 'class-validator';

export class CreateInvoiceDto {
  @IsString()
  number: string;

  @IsString()
  customer: string;

  @IsNumber()
  @Min(0)
  amount: number;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsDateString()
  dueDate: string;

  @IsOptional()
  @IsString()
  description?: string;
}
