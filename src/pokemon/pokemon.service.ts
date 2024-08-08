import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { isValidObjectId, Model } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';

import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { InjectModel } from '@nestjs/mongoose';
import { PaginationDto } from '../common/Dto/pagination.dto';

@Injectable()
export class PokemonService {
  // Inyeccion de dependencias
  constructor(
    @InjectModel(Pokemon.name) // Se debe de inyectar el nombre del modelo ya que es un requerimiento de mongoose
    private readonly pokemonModel: Model<Pokemon>, // Inyectamos el modelo de la entidad Pokemon
  ) {}

  // Es asincrono ya que se realizara una operacion de lectura/escritura a la base de datos
  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLowerCase();

    try {
      // Creamos el pokemon
      const pokemon = await this.pokemonModel.create(createPokemonDto);

      return pokemon;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  // Paginacion haciendo que por defecto traiga 20 pokemones
  findAll(paginationDto: PaginationDto) {

    // Se obtienen los valores de limit y offset del DTO y se asignan valores por defecto
    const {limit = 10, offset = 0} = paginationDto;

    return this.pokemonModel.find()
      .limit(limit) // Limitamos la cantidad de pokemones que se traeran
      .skip(offset) // Saltamos los primeros 5 pokemones
      .sort({
        no: 1, // Ordenamos de forma ascendente la columna no
      })
      .select('-__v'); // Seleccionamos todos los campos menos el campo __v
  }

  async findOne(term: string) {
    
    let pokemon: Pokemon;

    // Si el termino no es un numero
    if (!isNaN(+term)) {
      pokemon = await this.pokemonModel.findOne({ no: term });
    }

    // MongoId
    if ( !pokemon && isValidObjectId(term) ) { // isValidObjectId es una funcion de mongoose que valida si un string es un ObjectId
      pokemon = await this.pokemonModel.findById(term);
    }

    // Name
    if (!pokemon) {
      pokemon = await this.pokemonModel.findOne({name: term.toLowerCase().trim()}); // Se busca el pokemon por nombre y se convierte a minusculas y se eliminan los espacios
    }

    // Si no se encontro el pokemon se lanza una excepcion
    if (!pokemon) {
      throw new NotFoundException(`Pokemon with term ${term} not found`);
    }

    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {

    const pokemon = await this.findOne(term); // Se busca el pokemon

    if (updatePokemonDto.name) {
      updatePokemonDto.name = updatePokemonDto.name.toLowerCase();
    }

    try {
      // Actualizamos el pokemon
      await pokemon.updateOne(updatePokemonDto);
      return {...pokemon.toJSON(), ...updatePokemonDto};
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async remove(id: string) {
    
    // const pokemon = await this.findOne(id); // Se busca el pokemon
    // const pokemon = await this.pokemonModel.findByIdAndDelete(id); // Se elimina el pokemon, pero para eso el id debe de ser un ObjectId y en este caso puede ser un numero o un nombre
    // await pokemon.deleteOne(); // Se elimina el pokemon

    // const result = await this.pokemonModel.findByIdAndDelete(id); // funciona pero no se puede validar si el pokemon existe o no
    const {deletedCount} = await this.pokemonModel.deleteOne({_id: id});

    if (!deletedCount) { // deletedCount === 0
      throw new BadRequestException(`Pokemon with id ${id} not found`);
    }

    return;
  }

  // Funcion para manejar excepciones
  private handleExceptions(error: any) {
    if (error.code === 11000) {
      // Si el error es de duplicado
      throw new BadRequestException(
        `Pokemon already exists ${JSON.stringify(error.keyValue)}`,
      );
    } else {
      console.error(error);
      throw new InternalServerErrorException(`Can't create pokemon`);
    }
  }
}
