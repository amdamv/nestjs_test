import { IsEmail, IsNumber, IsOptional, IsString, Min, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class UpdateUserDto {
  @IsString()
  @MinLength(2)
  @IsOptional()
  fullname?: string;

  @ApiProperty({ example: 'amd123@gmail.com', required: true })
  @IsEmail(undefined, { message: 'Please provide valid Email' })
  @IsOptional()
  email?: string;

  @IsOptional()
  password?: string;

  @IsNumber()
  @IsOptional()
  age?: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  refreshToken?: string;

  @IsOptional()
  deletedAt?: number;

  @IsOptional()
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @Min(0)
  balance?: number;
}
