import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
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

  // Asociar un supermercado a una ciudad
  async addSupermarketToCity(cityId: number, supermarketId: number): Promise<Ciudad> {
  const ciudad = await this.ciudadRepository.findOne({
    where: { id: cityId },
    relations: ['supermercados']  // Cargando los supermercados
  });

  if (!ciudad) {
    throw new NotFoundException(`Ciudad con ID ${cityId} no encontrada`);
  }

  const supermercado = await this.supermercadoRepository.findOneBy({ id: supermarketId });
  if (!supermercado) {
    throw new NotFoundException(`Supermercado con ID ${supermarketId} no encontrado`);
  }

  // Verificar si el supermercado ya está asociado
  if (ciudad.supermercados.find(s => s.id === supermercado.id)) {
    throw new BadRequestException(`El supermercado con ID ${supermarketId} ya está asociado a la ciudad con ID ${cityId}`);
  }

  // Asociar el supermercado y guardar
  ciudad.supermercados.push(supermercado);
  return this.ciudadRepository.save(ciudad);
}


  // Obtener todos los supermercados asociados a una ciudad
  async findSupermarketsFromCity(cityId: number): Promise<Supermercado[]> {
    const ciudad = await this.ciudadRepository.findOne({
      where: { id: cityId },
      relations: ['supermercados']
    });

    if (!ciudad) {
      throw new NotFoundException(`Ciudad con ID ${cityId} no encontrada`);
    }

    if (ciudad.supermercados.length === 0) {
      throw new NotFoundException(`No hay supermercados asociados a la ciudad con ID ${cityId}`);
    }

    return ciudad.supermercados;
  }

  // Obtener un supermercado asociado a una ciudad
  async findSupermarketFromCity(cityId: number, supermarketId: number): Promise<Supermercado> {
  const ciudad = await this.ciudadRepository.findOne({
    where: { id: cityId },
    relations: ['supermercados']  // Cargando la relación supermercados
  });

  if (!ciudad) {
    throw new NotFoundException(`Ciudad con ID ${cityId} no encontrada`);
  }

  // Verifica si el supermercado está dentro de la lista de supermercados asociados
  const supermercado = ciudad.supermercados.find(s => s.id == supermarketId);
  if (!supermercado) {
    throw new NotFoundException(`Supermercado con ID ${supermarketId} no encontrado en la ciudad con ID ${cityId}`);
  }

  return supermercado;
}

  // Actualizar los supermercados asociados a una ciudad
  async updateSupermarketsFromCity(cityId: number, supermarketIds: number[]): Promise<Ciudad> {
    const ciudad = await this.ciudadRepository.findOne({
      where: { id: cityId },
      relations: ['supermercados']
    });
  
    if (!ciudad) {
      throw new NotFoundException(`Ciudad con ID ${cityId} no encontrada`);
    }
  
      // Agregar un log para ver qué supermercados están asociados
    console.log('Supermercados asociados:', ciudad.supermercados);

    // Validar que supermarketIds sea un array y que no esté vacío
    if (!Array.isArray(supermarketIds) || supermarketIds.length === 0) {
      throw new BadRequestException('Debe proporcionar una lista válida de IDs de supermercados.');
    }
  
    // Buscar los supermercados asociados por los IDs proporcionados
    const supermercados = await this.supermercadoRepository.findBy({
      id: In(supermarketIds)
    });
  
    // Validar que se encontraron todos los supermercados solicitados
    if (supermercados.length !== supermarketIds.length) {
      throw new NotFoundException('Algunos de los supermercados proporcionados no existen.');
    }
  
    // Actualizar los supermercados asociados a la ciudad
    ciudad.supermercados = supermercados;
    return this.ciudadRepository.save(ciudad);
  }
  

  // Eliminar un supermercado asociado a una ciudad
  async deleteSupermarketFromCity(cityId: number, supermarketId: number): Promise<Ciudad> {
    const ciudad = await this.ciudadRepository.findOne({
      where: { id: cityId },
      relations: ['supermercados'] // Asegúrate de que la relación esté correctamente cargada
    });
  
    if (!ciudad) {
      throw new NotFoundException(`Ciudad con ID ${cityId} no encontrada`);
    }
  
    console.log('Supermercados asociados a la ciudad:', ciudad.supermercados); // Log para verificar los supermercados
  
    const supermercadoAsociado = ciudad.supermercados.find(s => s.id == supermarketId);
    if (!supermercadoAsociado) {
      throw new NotFoundException(`Supermercado con ID ${supermarketId} no está asociado a la ciudad con ID ${cityId}`);
    }
  
    // Elimina el supermercado de la lista de supermercados asociados
    ciudad.supermercados = ciudad.supermercados.filter(s => s.id !== supermarketId);
    return this.ciudadRepository.save(ciudad);
  }
  
}
