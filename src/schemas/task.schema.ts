import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

export type TaskDocument = Task & Document;

@Schema({ timestamps: true })
export class Task {
  @Prop({ required: true })
  text: string;

  @Prop()
  deadline: Date;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  user: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Column' })
  column: Types.ObjectId;

  @Prop({ default: false })
  completed: boolean;
}
export const TaskSchema = SchemaFactory.createForClass(Task);
