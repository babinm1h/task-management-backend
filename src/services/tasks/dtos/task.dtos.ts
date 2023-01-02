import { IsNotEmpty, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  text: string;

  @IsNotEmpty()
  deadline: Date;

  @IsNotEmpty()
  columnId: Types.ObjectId;
}

export class UpdateTaskDto {
  columnId?: Types.ObjectId;
  text?: string;
  deadline?: Date;
  fromIndex?: number;
  toIndex?: number;
  completed?: boolean;
  @IsNotEmpty()
  id: Types.ObjectId;
}
