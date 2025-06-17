import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, MinLength } from 'class-validator';

export class CreateUserDto{
    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    fullname: string

    @IsNotEmpty()
    @IsEmail(undefined, {message: 'Please provide valid Email'} )
    email: string

    @IsNotEmpty()
    password: string

    @IsNumber()
    age?: number

   @IsOptional()
    @IsString()
    description?:  string

    @IsOptional()
    @IsString()
    refreshToken?: string
}
