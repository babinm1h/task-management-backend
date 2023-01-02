import { IsNotEmpty, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class createColumnDto {
  @IsNotEmpty()
  projectId: Types.ObjectId;

  @IsString()
  @IsNotEmpty()
  name: string;
}

export class updateColumnDto {
  @IsNotEmpty()
  columnId: string;
  name: string;
}
