import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  fullname: string;

  @ApiProperty({ example: 'amd123@gmail.com', required: true })
  @IsNotEmpty()
  @IsEmail(undefined, { message: 'Please provide valid Email' })
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNumber()
  age?: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  refreshToken?: string;

  @IsOptional()
  deletedAt: number;
}
