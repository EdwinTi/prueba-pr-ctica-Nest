import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { SupermercadoService } from './supermercado.service';
import { Supermercado } from './supermercado.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';

describe('SupermercadoService', () => {
  let service: SupermercadoService;
  let repository: Repository<Supermercado>;
  let supermercado: Supermercado;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [SupermercadoService],
    }).compile();

    service = module.get<SupermercadoService>(SupermercadoService);
    repository = module.get<Repository<Supermercado>>(getRepositoryToken(Supermercado));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    await repository.clear();

    supermercado = await repository.save({
      nombre: faker.company.name(),
      longitud: faker.address.longitude(), 
      latitud: faker.address.latitude(), 
       
      paginaWeb: faker.internet.url(),
    });
  };

  describe('findAll', () => {
    it('should return an array of supermarkets', async () => {
      const result = await service.findAll();
      expect(result.length).toBeGreaterThan(0);
      expect(result).toBeInstanceOf(Array);
    });
  });

  describe('findOne', () => {
    it('should return a supermarket if it exists', async () => {
      const result = await service.findOne(supermercado.id);
      expect(result).toBeInstanceOf(Supermercado);
      expect(result.nombre).toBe(supermercado.nombre);
    });

    it('should throw NotFoundException if supermarket is not found', async () => {
      const nonExistentId = 99999;  
      await expect(service.findOne(nonExistentId)).rejects.toThrow(new NotFoundException(`Supermercado con ID ${nonExistentId} no encontrado`));
    });
  });

  describe('create', () => {
    it('should create a new supermarket with valid data', async () => {
      const supermercadoData = {
        nombre: 'Supermercado Grande',  
        longitud: faker.address.longitude(), 
        latitud: faker.address.latitude(),  
          
        paginaWeb: faker.internet.url(),
      };
      const result = await service.create(supermercadoData);
      expect(result).toBeInstanceOf(Supermercado);
      expect(result.nombre).toBe(supermercadoData.nombre);
    });

    it('should throw an error if the name has less than 10 characters', async () => {
      const supermercadoData = {
        nombre: 'MiniMarket',  
        longitud: faker.address.longitude(), 
        latitud: faker.address.latitude(),        
        paginaWeb: faker.internet.url(),
      };
      await expect(service.create(supermercadoData)).rejects.toThrow('El nombre del supermercado debe tener más de 10 caracteres');
    });
  });

  describe('update', () => {
    it('should update the supermarket with valid data', async () => {
      const supermercadoData = { nombre: 'Supermercado Actualizado' };  
      const result = await service.update(supermercado.id, supermercadoData);
      expect(result.nombre).toBe(supermercadoData.nombre);
    });

    it('should throw NotFoundException if supermarket does not exist', async () => {
      const nonExistentId = 99999;
      const supermercadoData = { nombre: 'Supermercado Actualizado' };
      await expect(service.update(nonExistentId, supermercadoData)).rejects.toThrow(new NotFoundException(`Supermercado con ID ${nonExistentId} no encontrado`));
    });

    it('should throw an error if the name has less than 10 characters during update', async () => {
      const supermercadoData = { nombre: 'MiniMarkt' };  
      await expect(service.update(supermercado.id, supermercadoData)).rejects.toThrow('El nombre del supermercado debe tener más de 10 caracteres');
    });
  });

  describe('delete', () => {
    it('should delete a supermarket if it exists', async () => {
      await service.delete(supermercado.id);
      await expect(service.findOne(supermercado.id)).rejects.toThrow(new NotFoundException(`Supermercado con ID ${supermercado.id} no encontrado`));
    });

    it('should throw NotFoundException if supermarket does not exist', async () => {
      const nonExistentId = 99999;
      await expect(service.delete(nonExistentId)).rejects.toThrow(new NotFoundException(`Supermercado con ID ${nonExistentId} no encontrado`));
    });
  });
});
