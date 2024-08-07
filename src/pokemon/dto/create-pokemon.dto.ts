import { IsInt, IsPositive, IsString, Min, MinLength } from "class-validator";


export class CreatePokemonDto {

    @IsInt()
    @IsPositive()
    @Min(1) // Es diferente a @MinLength, ya que este acepta números
    no: number;

    @IsString()
    @MinLength(1)
    name: string;

}
