import { join } from 'path';
import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { PokemonModule } from './pokemon/pokemon.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CommonModule } from './common/common.module';
import { SeedModule } from './seed/seed.module';
import { ConfigModule } from '@nestjs/config';
import { EnvConfigurations } from './config/app.config';
import { JoiValidationSchema } from './config/joi.validation';

@Module({
  imports: [

    ConfigModule.forRoot({
      load: [EnvConfigurations], // Se carga la configuracion de las variables de entorno desde el archivo app.config.ts
      validationSchema: JoiValidationSchema, // Se valida el esquema de las variables de entorno
    }), // Este debe de ir al inicio de todos los imports

    ServeStaticModule.forRoot({
      rootPath: join(__dirname,'..','public'),
      }),

    // Connect to the database using Mongoose
    MongooseModule.forRoot(process.env.MONGODB),

    PokemonModule,

    CommonModule,

    SeedModule
  ],
})
export class AppModule {
  constructor() {}
}
