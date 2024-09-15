import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Supermercado } from './supermercado.entity';

@Injectable()
export class SupermercadoService {
  constructor(
    @InjectRepository(Supermercado)
    private supermercadoRepository: Repository<Supermercado>,
  ) {}

  
  async findAll(): Promise<Supermercado[]> {
    return this.supermercadoRepository.find();
  }

  
  async findOne(id: number): Promise<Supermercado> {
    const supermercado = await this.supermercadoRepository.findOneBy({ id });
    if (!supermercado) {
      throw new NotFoundException(`Supermercado con ID ${id} no encontrado`);
    }
    return supermercado;
  }

  
  async create(supermercadoData: { nombre: string; longitud: number; latitud: number; paginaWeb: string }): Promise<Supermercado> {
    if (supermercadoData.nombre.length <= 10) {
      throw new Error('El nombre del supermercado debe tener más de 10 caracteres');
    }
    const nuevoSupermercado = this.supermercadoRepository.create(supermercadoData);
    return this.supermercadoRepository.save(nuevoSupermercado);
  }

  
  async update(id: number, supermercadoData: { nombre?: string; longitud?: number; latitud?: number; paginaWeb?: string }): Promise<Supermercado> {
    const supermercado = await this.findOne(id); 
    if (supermercadoData.nombre && supermercadoData.nombre.length <= 10) {
      throw new Error('El nombre del supermercado debe tener más de 10 caracteres');
    }
    this.supermercadoRepository.merge(supermercado, supermercadoData);
    return this.supermercadoRepository.save(supermercado);
  }

  
  async delete(id: number): Promise<void> {
    const result = await this.supermercadoRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Supermercado con ID ${id} no encontrado`);
    }
  }
}
