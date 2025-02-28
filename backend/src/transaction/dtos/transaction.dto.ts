import { IsString, IsNumber, IsDateString, IsBoolean, IsOptional } from 'class-validator';

export class CreateTransactionDto {
  @IsString()
  @IsOptional()
  transaction_id?: string;

  @IsString()
  user_id?: string;

  @IsDateString()
  date: Date;

  @IsNumber()
  amount: number;

  @IsString()
  @IsOptional()
  currency: string;

  @IsString()
  category: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  deduction_rate?: number;

  @IsNumber()
  @IsOptional()
  max_limit?: number;

  @IsString()
  merchant: string;

  @IsString()
  payment_method: string;

  @IsString()
  country: string;

  @IsBoolean()
  @IsOptional()
  tax_deductible?: boolean;
}

export class UpdateTransactionDto {
    @IsString()
    @IsOptional()
    transaction_id?: string;
  
    @IsString()
    @IsOptional()
    user_id?: string;
  
    @IsDateString()
    @IsOptional()
    date?: Date;
  
    @IsNumber()
    @IsOptional()
    amount?: number;
  
    @IsString()
    @IsOptional()
    currency?: string;
  
    @IsString()
    @IsOptional()
    category?: string;
  
    @IsString()
    @IsOptional()
    description?: string;
  
    @IsNumber()
    @IsOptional()
    deduction_rate?: number;
  
    @IsNumber()
    @IsOptional()
    max_limit?: number;
  
    @IsString()
    @IsOptional()
    merchant?: string;
  
    @IsString()
    @IsOptional()
    payment_method?: string;
  
    @IsString()
    @IsOptional()
    country: string;
  
    @IsBoolean()
    @IsOptional()
    tax_deductible?: boolean;
  }