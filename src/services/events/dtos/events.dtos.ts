import { IsNotEmpty, IsString } from 'class-validator';

export class CreateEventDto {
  @IsNotEmpty()
  date: string;
  @IsNotEmpty()
  time: string;
  @IsNotEmpty()
  name: string;
}

export class UpdateEventDto {
  date?: string;
  time?: string;
  name?: string;

  @IsNotEmpty()
  @IsString()
  id: string;
}
