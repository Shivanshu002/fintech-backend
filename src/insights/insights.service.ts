import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Transaction, TransactionDocument } from '../transactions/transaction.schema';

@Injectable()
export class InsightsService {
  constructor(@InjectModel(Transaction.name) private txnModel: Model<TransactionDocument>) {}

  async getCategoryBreakdown(userId: string) {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    return this.txnModel.aggregate([
      {
        $match: {
          userId: new Types.ObjectId(userId),
          type: 'expense',
          date: { $gte: start, $lte: end },
        },
      },
      { $group: { _id: '$category', total: { $sum: '$amount' }, count: { $sum: 1 } } },
      { $sort: { total: -1 } },
    ]);
  }

  async getWeekComparison(userId: string) {
    const now = new Date();
    const dayOfWeek = now.getDay();

    const thisWeekStart = new Date(now);
    thisWeekStart.setDate(now.getDate() - dayOfWeek);
    thisWeekStart.setHours(0, 0, 0, 0);

    const lastWeekStart = new Date(thisWeekStart);
    lastWeekStart.setDate(thisWeekStart.getDate() - 7);
    const lastWeekEnd = new Date(thisWeekStart);
    lastWeekEnd.setMilliseconds(-1);

    const [thisWeek, lastWeek] = await Promise.all([
      this.txnModel.aggregate([
        { $match: { userId: new Types.ObjectId(userId), type: 'expense', date: { $gte: thisWeekStart, $lte: now } } },
        { $group: { _id: { $dayOfWeek: '$date' }, total: { $sum: '$amount' } } },
        { $sort: { _id: 1 } },
      ]),
      this.txnModel.aggregate([
        { $match: { userId: new Types.ObjectId(userId), type: 'expense', date: { $gte: lastWeekStart, $lte: lastWeekEnd } } },
        { $group: { _id: { $dayOfWeek: '$date' }, total: { $sum: '$amount' } } },
        { $sort: { _id: 1 } },
      ]),
    ]);

    const thisTotal = thisWeek.reduce((s, d) => s + d.total, 0);
    const lastTotal = lastWeek.reduce((s, d) => s + d.total, 0);
    const diff = thisTotal - lastTotal;
    const pct = lastTotal > 0 ? ((diff / lastTotal) * 100).toFixed(1) : '0';

    return {
      thisWeek: { total: thisTotal, daily: thisWeek },
      lastWeek: { total: lastTotal, daily: lastWeek },
      difference: diff,
      percentageChange: pct,
    };
  }

  async getMonthlyTrend(userId: string) {
    const now = new Date();
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

    return this.txnModel.aggregate([
      {
        $match: {
          userId: new Types.ObjectId(userId),
          date: { $gte: sixMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' },
            type: '$type',
          },
          total: { $sum: '$amount' },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);
  }

  async getSmartInsights(userId: string) {
    const breakdown = await this.getCategoryBreakdown(userId);
    const weekComp = await this.getWeekComparison(userId);

    const topCategory = breakdown[0];
    const totalExpense = breakdown.reduce((s: number, c: any) => s + c.total, 0);
    const topPct = totalExpense > 0 ? ((topCategory?.total / totalExpense) * 100).toFixed(0) : '0';

    const tips: string[] = [];
    if (topCategory) {
      tips.push(`${topCategory._id} is your biggest expense at ${topPct}% of total spending.`);
    }
    if (parseFloat(weekComp.percentageChange) > 10) {
      tips.push(`You spent ${weekComp.percentageChange}% more this week vs last week.`);
    }
    if (parseFloat(weekComp.percentageChange) < -10) {
      tips.push(`Great job! You spent ${Math.abs(parseFloat(weekComp.percentageChange))}% less this week.`);
    }

    return { categoryBreakdown: breakdown, weekComparison: weekComp, tips };
  }
}
