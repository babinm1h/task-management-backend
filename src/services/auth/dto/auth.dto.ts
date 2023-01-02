import { IsString, MinLength, MaxLength, IsEmail } from 'class-validator';

export class AuthDto {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @MaxLength(32)
  @MinLength(4)
  password: string;
}
