import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema() // Decorador para definir el esquema de la entidad, que se representa en la base de datos
export class Pokemon extends Document {

    // id lo da mongo

    @Prop({
        unique: true,
        index: true
    }) // Decorador para definir las propiedades de la entidad
    name: string;

    @Prop({
        unique: true,
        index: true
    })
    no: number;

}

// Exportamos el esquema de la entidad
export const PokemonSchema = SchemaFactory.createForClass(Pokemon);
