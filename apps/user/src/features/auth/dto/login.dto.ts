import { IsEmail, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class LoginDto {
  @IsNumber()
  id: number;

  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Min(6)
  password: string;
}
