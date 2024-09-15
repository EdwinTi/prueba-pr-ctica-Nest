import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ciudad } from './ciudad.entity';
import { CiudadService } from './ciudad.service';
import { CiudadController } from './ciudad.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Ciudad])],
  providers: [CiudadService],
  controllers: [CiudadController]
})
export class CiudadModule {}
