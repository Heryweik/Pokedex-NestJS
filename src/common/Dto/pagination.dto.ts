import { IsNumber, IsOptional, IsPositive, Min } from "class-validator";


// Es una clase porque es un DTO
export class PaginationDto {

    @IsOptional()
    @IsPositive()
    @IsNumber()
    @Min(1)
    limit?: number;

    @IsOptional()
    @IsNumber()
    @IsPositive()
    offset?: number;
}