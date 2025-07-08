import {
  Check,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
@Check(`"balance" >= 0`)
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 30 })
  fullname: string;

  @Column({ unique: true, type: 'varchar', length: 30 })
  email: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  password: string;

  @Column({ type: 'int', nullable: true })
  age: number;

  @Column({ type: 'varchar', length: 225, nullable: true })
  description?: string;

  @Column({ type: 'varchar', length: 512, nullable: true })
  avatar?: string | null;

  @Column({ type: 'varchar', length: 512, nullable: true })
  refreshToken?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;

  @Column({
    type: 'decimal',
    precision: 6,
    scale: 2,
    default: 0,
    transformer: {
      to: (value: number) => (value ? value.toFixed(2) : null),
      from: (value) => parseFloat(value),
    },
  })
  balance: number;
}
