// ciudad.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { Supermercado } from '../supermercado/supermercado.entity';

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

  @ManyToMany(() => Supermercado, supermercado => supermercado.ciudades)
  @JoinTable() // Esta anotación es necesaria solo en un lado de la relación
  supermercados: Supermercado[];
}
