import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { CiudadService } from './ciudad.service';
import { Ciudad } from './ciudad.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';

describe('CiudadService', () => {
  let service: CiudadService;
  let repository: Repository<Ciudad>;
  let ciudad: Ciudad;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [CiudadService],
    }).compile();

    service = module.get<CiudadService>(CiudadService);
    repository = module.get<Repository<Ciudad>>(getRepositoryToken(Ciudad));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    await repository.clear();  // Limpiar los datos previos en cada prueba

    ciudad = await repository.save({
      nombre: faker.address.city(),
      pais: 'Ecuador',
      numeroHabitantes: 9999,
    });
  };

  describe('findAll', () => {
    it('should return an array of cities', async () => {
      const result = await service.findAll();
      expect(result.length).toBeGreaterThan(0);
      expect(result).toBeInstanceOf(Array);
    });
  });

  describe('findOne', () => {
    it('should return a city if it exists', async () => {
      const result = await service.findOne(ciudad.id);
      expect(result).toBeInstanceOf(Ciudad);
      expect(result.nombre).toBe(ciudad.nombre);
    });

    it('should throw NotFoundException if city is not found', async () => {
      const nonExistentId = 99999;
      await expect(service.findOne(nonExistentId)).rejects.toThrow(new NotFoundException(`Ciudad con ID ${nonExistentId} no encontrada`));
    });
  });

  describe('create', () => {
    it('should create a new city with valid country', async () => {
      const ciudadData = { 
        nombre: faker.address.city(), 
        pais: 'Ecuador', 
        numeroHabitantes: 9999 
      };
      const result = await service.create(ciudadData);
      expect(result).toBeInstanceOf(Ciudad);
      expect(result.nombre).toBe(ciudadData.nombre);
      expect(result.pais).toBe(ciudadData.pais);
    });

    it('should throw an error if country is not valid', async () => {
      const ciudadData = { 
        nombre: faker.address.city(), 
        pais: 'USA',  // País no permitido según la lógica de validación
        numeroHabitantes: 9999 
      };
      await expect(service.create(ciudadData)).rejects.toThrow('El país no está en la lista permitida');
    });
  });

  describe('update', () => {
    it('should update the city with valid data', async () => {
      const ciudadData = { 
        nombre: faker.address.city(), 
        pais: 'Paraguay' 
      };
      const result = await service.update(ciudad.id, ciudadData);
      expect(result.nombre).toBe(ciudadData.nombre);
      expect(result.pais).toBe(ciudadData.pais);
    });

    it('should throw NotFoundException if city does not exist', async () => {
      const nonExistentId = 99999;
      const ciudadData = { nombre: faker.address.city() };
      await expect(service.update(nonExistentId, ciudadData)).rejects.toThrow(new NotFoundException(`Ciudad con ID ${nonExistentId} no encontrada`));
    });

    it('should throw an error if country is not valid during update', async () => {
      const ciudadData = { pais: 'USA' };  // País no permitido
      await expect(service.update(ciudad.id, ciudadData)).rejects.toThrow('El país no está en la lista permitida');
    });
  });

  describe('delete', () => {
    it('should delete a city if it exists', async () => {
      await service.delete(ciudad.id);
      await expect(service.findOne(ciudad.id)).rejects.toThrow(new NotFoundException(`Ciudad con ID ${ciudad.id} no encontrada`));
    });

    it('should throw NotFoundException if city does not exist', async () => {
      const nonExistentId = 99999;
      await expect(service.delete(nonExistentId)).rejects.toThrow(new NotFoundException(`Ciudad con ID ${nonExistentId} no encontrada`));
    });
  });
});
