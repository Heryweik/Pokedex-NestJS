import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { PokeResponse } from './interfaces/poke-response.interface';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';

@Injectable()
export class SeedService {
  // Hacemos que axios sea una dependencia de la clase
  // private readonly axios: AxiosInstance = axios;

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,

    // Inyectamos el adapter de axios
    // Viene desde el common module que fue exportado e importado en el seed module
    private readonly http: AxiosAdapter,
  ) {}

  // Método para ejecutar el seed, este de todas las maneras es el más eficiente
  async executeSeed() {
    // Limpiamos la base de datos
    await this.pokemonModel.deleteMany({});

    // Hacemos la petición a la api de pokemon usando el adapter de axios
    const data = await this.http.get<PokeResponse>(
      'https://pokeapi.co/api/v2/pokemon?limit=650',
    );

    // Creamos un array donde vamos a guardar los datos que vamos a insertar
    const pokemonToInsert: { name: string; no: number }[] = [];

    data.results.forEach(async ({ name, url }) => {
      const segments = url.split('/');
      const no = +segments[segments.length - 2];

      pokemonToInsert.push({ name, no }); // [ { name: 'bulbasaur', no: 1 }, ...]
    });

    await this.pokemonModel.insertMany(pokemonToInsert);

    return 'Seed executed';
  }

  /* async executeSeedPrueba2() {
    const {data} = await this.axios.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=10')

    // En la data ya tenemos el nombre pero el numero esta dentro del url, entonces hay que extraerlo
    data.results.forEach(async({name, url}) => {
      const segments = url.split('/');
      const no = +segments[segments.length - 2]; // extraemos el numero de la antepenultima parte del url, ya que vemos que en los segmentos esa parte es el numero: [ 'https:', '', 'pokeapi.co', 'api', 'v2', 'pokemon', '650', '' ]

      // Ingresamos los datos a la base de datos
      const pokemon = await this.pokemonModel.create({name, no});
    })

    return 'Seed executed';
  } */

  /* async executeSeedPrueba() {
    // Limpiamos la base de datos
    await this.pokemonModel.deleteMany({});

    const {data} = await this.axios.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=10')

    const insertPromisesArray = []

    data.results.forEach(async({name, url}) => {
      const segments = url.split('/');
      const no = +segments[segments.length - 2];

      insertPromisesArray.push(this.pokemonModel.create({name, no}));
    })

    await Promise.all(insertPromisesArray);

    return 'Seed executed';
  } */
}
