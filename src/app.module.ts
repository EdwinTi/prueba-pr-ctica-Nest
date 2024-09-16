import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CiudadModule } from './ciudad/ciudad.module';
import { SupermercadoModule } from './supermercado/supermercado.module';
import { CiudadSupermercadoModule } from './ciudad-supermercado/ciudad-supermercado.module';
import { Ciudad } from './ciudad/ciudad.entity'; 
import { Supermercado} from './supermercado/supermercado.entity'; 

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'gastronomia',
      entities: [ Ciudad, Supermercado  ],
      dropSchema: true,
      synchronize: true,
      keepConnectionAlive: true}
    ),
    CiudadModule, SupermercadoModule, CiudadSupermercadoModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}



