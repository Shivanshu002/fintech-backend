import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Goal, GoalDocument } from './goal.schema';

@Injectable()
export class GoalsService {
  constructor(@InjectModel(Goal.name) private goalModel: Model<GoalDocument>) {}

  async create(userId: string, data: Partial<Goal>): Promise<GoalDocument> {
    return this.goalModel.create({ ...data, userId: new Types.ObjectId(userId) });
  }

  async findAll(userId: string): Promise<GoalDocument[]> {
    return this.goalModel.find({ userId: new Types.ObjectId(userId) }).sort({ createdAt: -1 }).exec();
  }

  async findOne(userId: string, id: string): Promise<GoalDocument> {
    const goal = await this.goalModel.findById(id).exec();
    if (!goal) throw new NotFoundException('Goal not found');
    if (goal.userId.toString() !== userId) throw new ForbiddenException();
    return goal;
  }

  async update(userId: string, id: string, data: Partial<Goal>): Promise<GoalDocument> {
    await this.findOne(userId, id);
    const updated = await this.goalModel.findByIdAndUpdate(id, data, { new: true }).exec();
    return updated!;
  }

  async addAmount(userId: string, id: string, amount: number): Promise<GoalDocument> {
    const goal = await this.findOne(userId, id);
    const newAmount = goal.savedAmount + amount;
    const status = newAmount >= goal.targetAmount ? 'completed' : goal.status;
    const updated = await this.goalModel
      .findByIdAndUpdate(id, { savedAmount: newAmount, status }, { new: true })
      .exec();
    return updated!;
  }

  async remove(userId: string, id: string): Promise<void> {
    await this.findOne(userId, id);
    await this.goalModel.findByIdAndDelete(id).exec();
  }

  // Streak tracker - stored in goal as separate collection concept
  async getStreakSummary(userId: string) {
    const goals = await this.findAll(userId);
    const active = goals.filter((g) => g.status === 'active').length;
    const completed = goals.filter((g) => g.status === 'completed').length;
    return { active, completed, total: goals.length };
  }
}
