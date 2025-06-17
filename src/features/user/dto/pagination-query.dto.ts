import { IsOptional, IsPositive, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationQueryDto {
  @Type(() => Number)
  @IsPositive()
  limit: number;

  @Type(() => Number)
  @IsPositive()
  page: number;

  @IsOptional()
  @IsString()
  email: string
}