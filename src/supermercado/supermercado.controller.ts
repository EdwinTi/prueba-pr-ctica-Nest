import { Controller, Get, Post, Put, Delete, Param, Body, NotFoundException } from '@nestjs/common';
import { SupermercadoService } from './supermercado.service';
import { Supermercado } from './supermercado.entity';

@Controller('supermarkets')
export class SupermercadoController {
  constructor(private readonly supermercadoService: SupermercadoService) {}

  @Get()
  async findAll(): Promise<Supermercado[]> {
    return await this.supermercadoService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Supermercado> {
    return await this.supermercadoService.findOne(id);
  }

  @Post()
  async create(@Body() supermercadoData: Supermercado): Promise<Supermercado> {
    return await this.supermercadoService.create(supermercadoData);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() supermercadoData: Supermercado): Promise<Supermercado> {
    return await this.supermercadoService.update(id, supermercadoData);
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    return await this.supermercadoService.delete(id);
  }
}
