// ciudad-supermercado.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ciudad } from '../ciudad/ciudad.entity';
import { Supermercado } from '../supermercado/supermercado.entity';
import { CiudadSupermercadoService } from './ciudad-supermercado.service';
import { CiudadSupermercadoController } from './ciudad-supermercado.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Ciudad, Supermercado])],
  providers: [CiudadSupermercadoService],
  controllers: [CiudadSupermercadoController]
})
export class CiudadSupermercadoModule {}
