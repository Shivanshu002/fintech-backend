import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Transaction, TransactionDocument } from './transaction.schema';

@Injectable()
export class TransactionsService {
  constructor(@InjectModel(Transaction.name) private txnModel: Model<TransactionDocument>) {}

  async create(userId: string, data: Partial<Transaction>): Promise<TransactionDocument> {
    return this.txnModel.create({ ...data, userId: new Types.ObjectId(userId) });
  }

  async findAll(userId: string, query: any): Promise<TransactionDocument[]> {
    const filter: any = { userId: new Types.ObjectId(userId) };
    if (query.type) filter.type = query.type;
    if (query.category) filter.category = query.category;
    if (query.startDate || query.endDate) {
      filter.date = {};
      if (query.startDate) filter.date.$gte = new Date(query.startDate);
      if (query.endDate) filter.date.$lte = new Date(query.endDate);
    }
    if (query.search) {
      filter.note = { $regex: query.search, $options: 'i' };
    }
    return this.txnModel
      .find(filter)
      .sort({ date: -1 })
      .limit(query.limit ? parseInt(query.limit) : 100)
      .exec();
  }

  async findOne(userId: string, id: string): Promise<TransactionDocument> {
    const txn = await this.txnModel.findById(id).exec();
    if (!txn) throw new NotFoundException('Transaction not found');
    if (txn.userId.toString() !== userId) throw new ForbiddenException();
    return txn;
  }

  async update(userId: string, id: string, data: Partial<Transaction>): Promise<TransactionDocument> {
    await this.findOne(userId, id);
    const updated = await this.txnModel.findByIdAndUpdate(id, data, { new: true }).exec();
    return updated!;
  }

  async remove(userId: string, id: string): Promise<void> {
    await this.findOne(userId, id);
    await this.txnModel.findByIdAndDelete(id).exec();
  }

  async getSummary(userId: string) {
    const result = await this.txnModel.aggregate([
      { $match: { userId: new Types.ObjectId(userId) } },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' },
        },
      },
    ]);
    const summary = { income: 0, expense: 0, balance: 0 };
    result.forEach((r) => {
      if (r._id === 'income') summary.income = r.total;
      if (r._id === 'expense') summary.expense = r.total;
    });
    summary.balance = summary.income - summary.expense;
    return summary;
  }
}
