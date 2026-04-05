import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type GoalDocument = Goal & Document;

export enum GoalStatus {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  PAUSED = 'paused',
}

@Schema({ timestamps: true })
export class Goal {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  targetAmount: number;

  @Prop({ default: 0 })
  savedAmount: number;

  @Prop({ required: false, default: null })
  deadline: Date;

  @Prop({ enum: GoalStatus, default: GoalStatus.ACTIVE })
  status: GoalStatus;

  @Prop({ default: '' })
  icon: string;
}

export const GoalSchema = SchemaFactory.createForClass(Goal);
