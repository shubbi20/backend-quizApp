import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  name: string;

  @Column()
  password: string;

  @Column({
    default: 'regular',
  })
  role: string; //two types 1>regular 2>manager 3>admin

  // @OneToMany(() => RegisteredBike, (registeredBike) => registeredBike.userId)
  // regBike: RegisteredBike[];
}
