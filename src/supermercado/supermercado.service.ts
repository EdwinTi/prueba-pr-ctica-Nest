import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Supermercado } from './supermercado.entity';


@Injectable()
export class SupermercadoService {
  constructor(
    @InjectRepository(Supermercado)
    private supermercadoRepository: Repository<Supermercado>,
  ) {}

  // Obtener todos los supermercados
  async findAll(): Promise<Supermercado[]> {
    return this.supermercadoRepository.find();
  }

  // Obtener un supermercado por ID
  async findOne(id: number): Promise<Supermercado> {
    const supermercado = await this.supermercadoRepository.findOneBy({ id });
    if (!supermercado) {
      throw new NotFoundException(`Supermercado con ID ${id} no encontrado`);
    }
    return supermercado;
  }

  // Crear un supermercado nuevo
  async create(supermercadoData: { nombre: string; longitud: number; latitud: number; paginaWeb: string }): Promise<Supermercado> {
    // Validación del nombre (debe ser mayor a 10 caracteres)
    if (supermercadoData.nombre.length <= 10) {
      throw new BadRequestException('El nombre del supermercado debe tener más de 10 caracteres');
    }

    // Validación de las coordenadas
    if (supermercadoData.longitud < -180 || supermercadoData.longitud > 180) {
      throw new BadRequestException('La longitud debe estar entre -180 y 180 grados');
    }
    if (supermercadoData.latitud < -90 || supermercadoData.latitud > 90) {
      throw new BadRequestException('La latitud debe estar entre -90 y 90 grados');
    }

    const nuevoSupermercado = this.supermercadoRepository.create(supermercadoData);
    return this.supermercadoRepository.save(nuevoSupermercado);
  }

  // Actualizar un supermercado
  async update(id: number, supermercadoData: { nombre?: string; longitud?: number; latitud?: number; paginaWeb?: string }): Promise<Supermercado> {
    const supermercado = await this.findOne(id); 

    // Validación del nombre durante la actualización
    if (supermercadoData.nombre && supermercadoData.nombre.length <= 10) {
      throw new BadRequestException('El nombre del supermercado debe tener más de 10 caracteres');
    }

    // Validación de las coordenadas durante la actualización
    if (supermercadoData.longitud !== undefined && (supermercadoData.longitud < -180 || supermercadoData.longitud > 180)) {
      throw new BadRequestException('La longitud debe estar entre -180 y 180 grados');
    }
    if (supermercadoData.latitud !== undefined && (supermercadoData.latitud < -90 || supermercadoData.latitud > 90)) {
      throw new BadRequestException('La latitud debe estar entre -90 y 90 grados');
    }

    this.supermercadoRepository.merge(supermercado, supermercadoData);
    return this.supermercadoRepository.save(supermercado);
  }

  // Eliminar un supermercado
  async delete(id: number): Promise<void> {
    const result = await this.supermercadoRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Supermercado con ID ${id} no encontrado`);
    }
  }
  
}
