import { IsEmail, IsNotEmpty, IsNumber, IsString, IsUUID, MinLength } from 'class-validator';
import { PrimaryGeneratedColumn } from 'typeorm';

export class CreateUserDto{
    @PrimaryGeneratedColumn()
    id: number

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
    age: number

    @IsString()
    description?:  string

    @IsString()
    refreshToken?: string
}
