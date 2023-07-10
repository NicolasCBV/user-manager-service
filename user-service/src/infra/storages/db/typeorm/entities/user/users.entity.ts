import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  Unique,
} from 'typeorm';

@Entity('users')
@Index(['name', 'email'])
@Unique(['name'])
@Unique(['email'])
export class TypeORMUser {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 64 })
  name: string;

  @Column({ length: 256 })
  email: string;

  @Column({ length: 256 })
  password: string;

  @Column({ length: 256, nullable: true })
  description?: string;

  @Column({ length: 256, nullable: true })
  imageUrl?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
