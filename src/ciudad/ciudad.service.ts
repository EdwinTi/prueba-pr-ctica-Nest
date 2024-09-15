import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ciudad } from './ciudad.entity';

@Injectable()
export class CiudadService {
  constructor(
    @InjectRepository(Ciudad)
    private ciudadRepository: Repository<Ciudad>,
  ) {}

  
  private validCountries = ['Argentina', 'Ecuador', 'Paraguay'];

  
  async findAll(): Promise<Ciudad[]> {
    return this.ciudadRepository.find();
  }

  
  async findOne(id: number): Promise<Ciudad> {
    const ciudad = await this.ciudadRepository.findOneBy({ id });
    if (!ciudad) {
      throw new NotFoundException(`Ciudad con ID ${id} no encontrada`);
    }
    return ciudad;
  }

  
  async create(ciudadData: { nombre: string; pais: string; numeroHabitantes: number }): Promise<Ciudad> {
    if (!this.validCountries.includes(ciudadData.pais)) {
      throw new Error('El país no está en la lista permitida');
    }
    const nuevaCiudad = this.ciudadRepository.create(ciudadData);
    return this.ciudadRepository.save(nuevaCiudad);
  }

  
  async update(id: number, ciudadData: { nombre?: string; pais?: string; numeroHabitantes?: number }): Promise<Ciudad> {
    const ciudad = await this.findOne(id);  
    if (ciudadData.pais && !this.validCountries.includes(ciudadData.pais)) {
      throw new Error('El país no está en la lista permitida');
    }
    this.ciudadRepository.merge(ciudad, ciudadData);
    return this.ciudadRepository.save(ciudad);
  }

  
  async delete(id: number): Promise<void> {
    const result = await this.ciudadRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Ciudad con ID ${id} no encontrada`);
    }
  }
}
