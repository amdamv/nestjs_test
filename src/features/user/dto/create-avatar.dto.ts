import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAvatarDto {
  @ApiProperty({ example: 'profiles/avatars' })
  @IsString()
  @IsNotEmpty()
  readonly folder: string;

  @IsString()
  readonly name: string;
}
