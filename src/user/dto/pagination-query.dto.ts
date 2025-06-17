import { IsPositive } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationQueryDto {
  @Type(() => Number)
  @IsPositive()
  page: number

  @Type(() => Number)
  @IsPositive()
  limit: number
}