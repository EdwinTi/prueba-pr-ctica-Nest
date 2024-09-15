// supermercado.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Ciudad } from '../ciudad/ciudad.entity';

@Entity()
export class Supermercado {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 500 })
  nombre: string;

  @Column('double precision')
  longitud: number;

  @Column('double precision')
  latitud: number;

  @Column({ length: 500 })
  paginaWeb: string;

  @ManyToMany(() => Ciudad, ciudad => ciudad.supermercados)
  ciudades: Ciudad[];
}
