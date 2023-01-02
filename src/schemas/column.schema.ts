import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

export type ColumnDocument = Column & Document;

@Schema({ timestamps: true })
export class Column {
  @Prop({ required: true })
  name: string;

  @Prop({ type: Types.ObjectId, ref: 'Project' })
  project: Types.ObjectId;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Task' }], default: [] })
  tasks: Types.ObjectId[];
}
export const ColumnSchema = SchemaFactory.createForClass(Column);
