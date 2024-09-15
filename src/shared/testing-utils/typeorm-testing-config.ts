/* eslint-disable prettier/prettier */
/* archivo src/shared/testing-utils/typeorm-testing-config.ts*/
import { TypeOrmModule } from '@nestjs/typeorm';

import { Ciudad } from '../../ciudad/ciudad.entity';
import { Supermercado } from '../../supermercado/supermercado.entity';  


export const TypeOrmTestingConfig = () => [
 TypeOrmModule.forRoot({
   type: 'sqlite',
   database: ':memory:',
   dropSchema: true,
   entities: [Ciudad,Supermercado],
   synchronize: true,
   keepConnectionAlive: true
 }),
 TypeOrmModule.forFeature([Ciudad, Supermercado]),
];
/* archivo src/shared/testing-utils/typeorm-testing-config.ts*/
