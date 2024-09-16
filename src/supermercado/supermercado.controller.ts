import { Controller, Get, Post, Put, Delete, Param, Body, NotFoundException } from '@nestjs/common';
import { SupermercadoService } from './supermercado.service';
import { Supermercado } from './supermercado.entity';
import { plainToInstance } from 'class-transformer';

@Controller('supermarkets')
export class SupermercadoController {
  constructor(private readonly supermercadoService: SupermercadoService) {}

  @Get()
  async findAll() {
    return this.supermercadoService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.supermercadoService.findOne(id);
  }

  @Post()
  async create(@Body() supermercadoData: Supermercado) {
    const supermercado = plainToInstance(Supermercado, supermercadoData);
    return this.supermercadoService.create(supermercado);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() supermercadoData: Supermercado) {
    const supermercado = plainToInstance(Supermercado, supermercadoData);
    return this.supermercadoService.update(id, supermercado);
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    return this.supermercadoService.delete(id);
  }
  
}
