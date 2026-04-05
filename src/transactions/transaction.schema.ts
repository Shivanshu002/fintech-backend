import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type TransactionDocument = Transaction & Document;

export enum TransactionType {
  INCOME = 'income',
  EXPENSE = 'expense',
  TRANSFER = 'transfer',
}

export enum Category {
  FOOD = 'food',
  TRANSPORT = 'transport',
  BILLS = 'bills',
  SHOPPING = 'shopping',
  HEALTH = 'health',
  ENTERTAINMENT = 'entertainment',
  SALARY = 'salary',
  FREELANCE = 'freelance',
  OTHER = 'other',
}

@Schema({ timestamps: true })
export class Transaction {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true, enum: TransactionType })
  type: TransactionType;

  @Prop({ required: true, lowercase: true, trim: true })
  category: string;

  @Prop({ default: () => new Date() })
  date: Date;

  @Prop({ default: '' })
  note: string;

  @Prop({ default: 'Savings' })
  account: string;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
