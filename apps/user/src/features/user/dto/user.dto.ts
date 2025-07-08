import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, Min, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

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

  @IsOptional()
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @Min(0)
  balance?: number;
}
