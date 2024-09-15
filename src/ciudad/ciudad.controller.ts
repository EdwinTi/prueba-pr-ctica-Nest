import { Controller, Get, Post, Put, Delete, Param, Body, NotFoundException } from '@nestjs/common';
import { CiudadService } from './ciudad.service';
import { Ciudad } from './ciudad.entity';

@Controller('cities')
export class CiudadController {
  constructor(private readonly ciudadService: CiudadService) {}

  @Get()
  async findAll(): Promise<Ciudad[]> {
    return await this.ciudadService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Ciudad> {
    return await this.ciudadService.findOne(id);
  }

  @Post()
  async create(@Body() ciudadData: Ciudad): Promise<Ciudad> {
    return await this.ciudadService.create(ciudadData);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() ciudadData: Ciudad): Promise<Ciudad> {
    return await this.ciudadService.update(id, ciudadData);
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    return await this.ciudadService.delete(id);
  }
}
