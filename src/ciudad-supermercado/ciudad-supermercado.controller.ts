import { Controller, Get, Post, Put, Delete, Param, Body, NotFoundException } from '@nestjs/common';
import { CiudadSupermercadoService } from './ciudad-supermercado.service';
import { Supermercado } from '../supermercado/supermercado.entity';
import { Ciudad } from '../ciudad/ciudad.entity';

@Controller('ciudades/:cityId/supermercados')
export class CiudadSupermercadoController {
  constructor(private readonly ciudadSupermercadoService: CiudadSupermercadoService) {}

  @Post(':supermarketId')
  async addSupermarketToCity(@Param('cityId') cityId: number, @Param('supermarketId') supermarketId: number): Promise<Ciudad> {
    return await this.ciudadSupermercadoService.addSupermarketToCity(cityId, supermarketId);
  }

  @Get()
  async findSupermarketsFromCity(@Param('cityId') cityId: number): Promise<Supermercado[]> {
    return await this.ciudadSupermercadoService.findSupermarketsFromCity(cityId);
  }

  @Get(':supermarketId')
  async findSupermarketFromCity(@Param('cityId') cityId: number, @Param('supermarketId') supermarketId: number): Promise<Supermercado> {
    return await this.ciudadSupermercadoService.findSupermarketFromCity(cityId, supermarketId);
  }

  @Put()
  async updateSupermarketsFromCity(
    @Param('cityId') cityId: number, 
    @Body('supermarketIds') supermarketIds: number[]
  ): Promise<Ciudad> {
    return await this.ciudadSupermercadoService.updateSupermarketsFromCity(cityId, supermarketIds);
  }
  

  @Delete(':supermarketId')
  async deleteSupermarketFromCity(@Param('cityId') cityId: number, @Param('supermarketId') supermarketId: number): Promise<Ciudad> {
    return await this.ciudadSupermercadoService.deleteSupermarketFromCity(cityId, supermarketId);
  }
}
