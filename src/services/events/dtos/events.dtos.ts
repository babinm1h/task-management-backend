import { IsNotEmpty } from 'class-validator';

export class CreateEventDto {
  @IsNotEmpty()
  date: string;
  @IsNotEmpty()
  time: string;
  @IsNotEmpty()
  name: string;
}
