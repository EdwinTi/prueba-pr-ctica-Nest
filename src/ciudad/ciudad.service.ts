import { Injectable, NotFoundException, BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
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
      throw new BadRequestException('El país proporcionado no está en la lista permitida');
    }
    if (ciudadData.nombre.length === 0) {
      throw new BadRequestException('El nombre de la ciudad no puede estar vacío');
    }
    if (ciudadData.numeroHabitantes <= 0) {
      throw new BadRequestException('El número de habitantes debe ser mayor que cero');
    }
    const nuevaCiudad = this.ciudadRepository.create(ciudadData);
    return this.ciudadRepository.save(nuevaCiudad);
  }

  async update(id: number, ciudadData: { nombre?: string; pais?: string; numeroHabitantes?: number }): Promise<Ciudad> {
    const ciudad = await this.findOne(id);
    if (ciudadData.pais && !this.validCountries.includes(ciudadData.pais)) {
      throw new BadRequestException('El país no está en la lista permitida');
    }
    if (ciudadData.nombre && ciudadData.nombre.trim().length === 0) {
      throw new BadRequestException('El nombre de la ciudad no puede estar vacío');
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
