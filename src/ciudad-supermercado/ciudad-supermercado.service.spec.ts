import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { CiudadSupermercadoService } from './ciudad-supermercado.service';
import { Ciudad } from '../ciudad/ciudad.entity';
import { Supermercado } from '../supermercado/supermercado.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';

describe('CiudadSupermercadoService', () => {
  let service: CiudadSupermercadoService;
  let ciudadRepository: Repository<Ciudad>;
  let supermercadoRepository: Repository<Supermercado>;
  let ciudad: Ciudad;
  let supermercadosList: Supermercado[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [CiudadSupermercadoService],
    }).compile();

    service = module.get<CiudadSupermercadoService>(CiudadSupermercadoService);
    ciudadRepository = module.get<Repository<Ciudad>>(getRepositoryToken(Ciudad));
    supermercadoRepository = module.get<Repository<Supermercado>>(getRepositoryToken(Supermercado));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    await ciudadRepository.clear();
    await supermercadoRepository.clear();
  
    supermercadosList = [];
    for (let i = 0; i < 5; i++) {
      const supermercado: Supermercado = await supermercadoRepository.save({
        nombre: faker.company.name(),
        direccion: faker.address.streetAddress(),
        longitud: faker.address.longitude(), // Convertimos a número
        latitud: faker.address.latitude(),   // Convertimos a número
        paginaWeb: faker.internet.url()
      });
      supermercadosList.push(supermercado);
    }
  
    ciudad = await ciudadRepository.save({
      nombre: faker.address.city(),
      pais: faker.address.country(),
      numeroHabitantes: 100000,  // Añadir el valor requerido de número de habitantes
      supermercados: supermercadosList,
    });
  };
  

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('addSupermarketToCity', () => {
    let newSupermercado: Supermercado;

    beforeEach(async () => {
      newSupermercado = await supermercadoRepository.save({
        nombre: faker.company.name(),
        direccion: faker.address.streetAddress(),
        longitud: faker.address.longitude(),
        latitud: faker.address.latitude(),
        paginaWeb: faker.internet.url()
      });
    });

    it('should add a supermarket to a city', async () => {
      const result = await service.addSupermarketToCity(ciudad.id, newSupermercado.id);
      expect(result).toBeInstanceOf(Ciudad);
      expect(result.supermercados.length).toBe(supermercadosList.length + 1);
      expect(result.supermercados.some(s => s.id === newSupermercado.id)).toBe(true);
    });

    it('should throw a NotFoundException if the city is not found', async () => {
      await expect(service.addSupermarketToCity(99999, newSupermercado.id)).rejects.toThrow(
        new NotFoundException('Ciudad con ID 99999 no encontrada')
      );
    });

    it('should throw a NotFoundException if the supermarket is not found', async () => {
      await expect(service.addSupermarketToCity(ciudad.id, 99999)).rejects.toThrow(
        new NotFoundException('Supermercado con ID 99999 no encontrado')
      );
    });
  });

  describe('findSupermarketsFromCity', () => {
    it('should return an array of supermarkets for a city', async () => {
      const result = await service.findSupermarketsFromCity(ciudad.id);
      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBe(supermercadosList.length);
    });

    it('should throw a NotFoundException if the city is not found', async () => {
      await expect(service.findSupermarketsFromCity(99999)).rejects.toThrow(
        new NotFoundException('Ciudad con ID 99999 no encontrada')
      );
    });
  });

  describe('findSupermarketFromCity', () => {
    it('should return a supermarket from a city', async () => {
      const result = await service.findSupermarketFromCity(ciudad.id, supermercadosList[0].id);
      expect(result).toBeInstanceOf(Supermercado);
    });

    it('should throw a NotFoundException if the supermarket is not found', async () => {
      await expect(service.findSupermarketFromCity(ciudad.id, 99999)).rejects.toThrow(
        new NotFoundException('Supermercado con ID 99999 no encontrado en la ciudad con ID ' + ciudad.id)
      );
    });
  });

  describe('updateSupermarketsFromCity', () => {
    it('should update the supermarkets for a city', async () => {
      const newSupermercados: Supermercado[] = [];
      for (let i = 0; i < 3; i++) {
        const supermercado: Supermercado = await supermercadoRepository.save({
          nombre: faker.company.name(),
          direccion: faker.address.streetAddress(),
          longitud: faker.address.longitude(),
          latitud: faker.address.latitude(),
          paginaWeb: faker.internet.url()
        });
        newSupermercados.push(supermercado);
      }

      const result = await service.updateSupermarketsFromCity(ciudad.id, newSupermercados.map(s => s.id));
      expect(result).toBeInstanceOf(Ciudad);
      expect(result.supermercados.length).toBe(newSupermercados.length);
    });

    it('should throw a NotFoundException if the city is not found', async () => {
      await expect(service.updateSupermarketsFromCity(99999, supermercadosList.map(s => s.id))).rejects.toThrow(
        new NotFoundException('Ciudad con ID 99999 no encontrada')
      );
    });
  });

  describe('deleteSupermarketFromCity', () => {
    it('should delete a supermarket from a city', async () => {
      const initialCount = ciudad.supermercados.length;
      const result = await service.deleteSupermarketFromCity(ciudad.id, supermercadosList[0].id);
      expect(result).toBeInstanceOf(Ciudad);
      expect(result.supermercados.length).toBe(initialCount - 1);
      expect(result.supermercados.find(s => s.id === supermercadosList[0].id)).toBeUndefined();
    });

    it('should throw a NotFoundException if the city is not found', async () => {
      await expect(service.deleteSupermarketFromCity(99999, supermercadosList[0].id)).rejects.toThrow(
        new NotFoundException('Ciudad con ID 99999 no encontrada')
      );
    });
  });
});
