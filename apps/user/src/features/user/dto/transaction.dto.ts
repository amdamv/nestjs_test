import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class TransactionDto {
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @Min(0.01)
  @IsNotEmpty()
  amount: number;

  @IsNotEmpty()
  @IsString()
  senderId: string;

  @IsNotEmpty()
  @IsString()
  receiverId: string;
}
