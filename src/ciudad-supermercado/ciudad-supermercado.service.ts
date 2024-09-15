
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Ciudad } from '../ciudad/ciudad.entity';
import { Supermercado } from '../supermercado/supermercado.entity';

@Injectable()
export class CiudadSupermercadoService {
  constructor(
    @InjectRepository(Ciudad)
    private ciudadRepository: Repository<Ciudad>,
    @InjectRepository(Supermercado)
    private supermercadoRepository: Repository<Supermercado>
  ) {}

  
  async addSupermarketToCity(cityId: number, supermarketId: number): Promise<Ciudad> {
    const ciudad = await this.ciudadRepository.findOne({
      where: { id: cityId },
      relations: ['supermercados']
    });

    if (!ciudad) {
      throw new NotFoundException(`Ciudad con ID ${cityId} no encontrada`);
    }

    const supermercado = await this.supermercadoRepository.findOneBy({ id: supermarketId });
    if (!supermercado) {
      throw new NotFoundException(`Supermercado con ID ${supermarketId} no encontrado`);
    }

    ciudad.supermercados.push(supermercado);
    return this.ciudadRepository.save(ciudad);
  }

  
  async findSupermarketsFromCity(cityId: number): Promise<Supermercado[]> {
    const ciudad = await this.ciudadRepository.findOne({
      where: { id: cityId },
      relations: ['supermercados']
    });

    if (!ciudad) {
      throw new NotFoundException(`Ciudad con ID ${cityId} no encontrada`);
    }

    return ciudad.supermercados;
  }

  
  async findSupermarketFromCity(cityId: number, supermarketId: number): Promise<Supermercado> {
    const ciudad = await this.ciudadRepository.findOne({
      where: { id: cityId },
      relations: ['supermercados']
    });

    if (!ciudad) {
      throw new NotFoundException(`Ciudad con ID ${cityId} no encontrada`);
    }

    const supermercado = ciudad.supermercados.find(s => s.id === supermarketId);
    if (!supermercado) {
      throw new NotFoundException(`Supermercado con ID ${supermarketId} no encontrado en la ciudad con ID ${cityId}`);
    }

    return supermercado;
  }

  
  async updateSupermarketsFromCity(cityId: number, supermarketIds: number[]): Promise<Ciudad> {
    const ciudad = await this.ciudadRepository.findOne({
      where: { id: cityId },
      relations: ['supermercados']
    });

    if (!ciudad) {
      throw new NotFoundException(`Ciudad con ID ${cityId} no encontrada`);
    }

    const supermercados = await this.supermercadoRepository.findBy({ id: In(supermarketIds) });
    ciudad.supermercados = supermercados;
    return this.ciudadRepository.save(ciudad);
  }
  
  
  async deleteSupermarketFromCity(cityId: number, supermarketId: number): Promise<Ciudad> {
    const ciudad = await this.ciudadRepository.findOne({
      where: { id: cityId },
      relations: ['supermercados']
    });

    if (!ciudad) {
      throw new NotFoundException(`Ciudad con ID ${cityId} no encontrada`);
    }

    ciudad.supermercados = ciudad.supermercados.filter(s => s.id !== supermarketId);
    return this.ciudadRepository.save(ciudad);
  }
}
