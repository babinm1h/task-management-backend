import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

export type ProjectDocument = Project & Document;

@Schema({ timestamps: true })
export class Project {
  @Prop({ required: true })
  name: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  user: Types.ObjectId;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Column' }] })
  columns: Types.ObjectId[];

  @Prop({ default: 0 })
  tasksCount: number;
}
export const ProjectSchema = SchemaFactory.createForClass(Project);
