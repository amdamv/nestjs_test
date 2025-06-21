import {Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from "typeorm";

@Entity()
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column({type: "varchar", length: 30})
    fullname: string

    @Column({ unique: true, type: "varchar", length: 30})
    email: string

    @Column({type: "varchar", length: 100, nullable: false})
    password: string

    @Column({type: 'int', nullable: true})
    age: number

    @Column({type: "varchar", length: 225, nullable: true})
    description?: string

    @Column({type: 'varchar', length: 512, nullable: true})
    refreshToken?: string

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date
}
