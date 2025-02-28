import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TransactionDocument = Transaction & Document;

@Schema()
export class Transaction {
  @Prop({ required: true, unique: true }) // Ensure transaction_id is unique
  transaction_id: string;

  @Prop({ required: true }) // Link to the user who made the transaction
  user_id: string;

  @Prop({ required: true }) // Date of the transaction
  date: Date;

  @Prop({ required: true }) // Amount of the transaction
  amount: number;

  @Prop({ required: false, default: 'USD' }) // Currency, default to USD
  currency?: string;

  @Prop({ required: true }) // Category of the transaction (e.g., food, travel)
  category: string;

  @Prop({ required: false }) // Optional description of the transaction
  description: string;

  @Prop({ required: false, default: 0 }) // Deduction rate for tax purposes
  deduction_rate: number;

  @Prop({ required: false,  default: 10000}) // Maximum limit for deductions (if applicable)
  max_limit: number;

  @Prop({ required: true }) // Merchant or vendor name
  merchant: string;

  @Prop({ required: true }) // Payment method used (e.g., credit card, cash)
  payment_method: string;

  @Prop({ required: true, default: 'US' }) // Country where the transaction occurred
  country: string;

  @Prop({ required: false, default: false }) // Whether the transaction is tax-deductible
  tax_deductible: boolean;

  readonly _id?: string; // Automatically added by MongoDB
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);