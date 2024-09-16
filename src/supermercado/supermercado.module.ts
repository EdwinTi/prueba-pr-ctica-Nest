import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Supermercado } from './supermercado.entity';
import { SupermercadoService } from './supermercado.service';
import { SupermercadoController } from './supermercado.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Supermercado])],
  providers: [SupermercadoService],
  controllers: [SupermercadoController]
})
export class SupermercadoModule {}
