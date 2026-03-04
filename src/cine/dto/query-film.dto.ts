import { Type } from "class-transformer";
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from "class-validator";
import { FilmStatus } from "../film-status.enum";

export class QueryFilmDto {
    @IsOptional()
    @Type(() => Number)
    @IsInt() @Min(1)
    page?: number;

    @IsOptional()
    @Type(() => Number)
    @IsInt() @Min(1) @Max(50)
    limit?: number;

    @IsOptional() @IsString()
    genre?: string;

    @IsOptional()
    @Type(() => Number)
    @IsInt() @Min(1700) @Max(new Date().getFullYear())
    year?: number;

    @IsOptional() @IsEnum(FilmStatus)
    status?: FilmStatus;

    @IsOptional() @IsString()
    ratingSort?: 'asc' | 'desc';

    @IsOptional() @IsString()
    yearSort?: 'asc' | 'desc';
}