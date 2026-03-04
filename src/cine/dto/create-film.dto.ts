import { ApiProperty } from '@nestjs/swagger';
import { FilmStatus } from "../film-status.enum";
import { ArrayNotEmpty, IsArray, IsDate, IsEnum, IsNotEmpty, IsNumber, IsString, Max, MaxLength, Min } from "class-validator";
import { Type } from 'class-transformer';


export class CreateFilmDto {
    @ApiProperty({
        example: 'The Batman',
        description: 'Titre du film',
        maxLength: 255
    })
    @IsString() @MaxLength(255)
    @IsNotEmpty()
    title: string;

    @ApiProperty({
        example: 'Jean DUJARDIN',
        description: 'Réalisateur du film',
        maxLength: 255
    })
    @IsString() @MaxLength(255)
    @IsNotEmpty()
    director: string;

    @ApiProperty({
        example: ['Leonardo DiCaprio', 'Joseph Gordon-Levitt'],
        description: 'Liste des acteursdu film',
        type: [String]
    })
    @IsArray()
    @ArrayNotEmpty()
    @IsString({ each: true })
    cast: string[];

    @ApiProperty({
        example: ['Action', 'Thriller'],
        description: 'Liste des genres du film',
        type: [String]
    })
    @IsArray()
    @ArrayNotEmpty()
    @IsString({ each: true })
    genres: string[];

    @ApiProperty({
        example: 2022,
        description: 'Année de sortie du film',
        minimum: 1700,
        maximum: new Date().getFullYear()
    })
    @IsNumber()
    @IsNotEmpty()
    @Max(new Date().getFullYear())
    @Min(1700)
    year: number;

    @ApiProperty({
        example: 120,
        description: 'Durée du film en minutes',
        minimum: 5,
        maximum: 820
    })
    @IsNotEmpty()
    @Type(() => Number)
    @Min(5)
    @Max(820)
    duration: number;

    @ApiProperty({
        example: 9.5,
        description: 'Note du film sur 10',
        minimum: 0,
        maximum: 10
    })
    @IsNotEmpty()
    @Type(() => Number)
    @Min(0)
    @Max(10)
    rating: number;

    @ApiProperty({
        example: 'Un justicier masqué lutte contre le crime à Gotham City.',
        description: 'Synopsis du film',
        maxLength: 2000
    })
    @IsString() @MaxLength(2000)
    synopsis: string;

    @ApiProperty({
        example: 'released',
        description: 'Statut du film',
        enum: FilmStatus
    })
    @IsNotEmpty()
    @IsEnum(FilmStatus)
    status: FilmStatus;

    @ApiProperty({
        example: 'en',
        description: 'Langue du film format court ex: "en" pour anglais, "fr" pour français',
        maxLength: 3
    })
    @IsString() @MaxLength(3)
    @IsNotEmpty()
    language: string;
}