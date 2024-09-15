import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Ciudad {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 500 })
  nombre: string;

  @Column({ length: 500 })
  pais: string;

  @Column()
  numeroHabitantes: number;
}
