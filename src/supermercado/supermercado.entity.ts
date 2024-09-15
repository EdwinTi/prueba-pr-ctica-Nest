import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

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
}
