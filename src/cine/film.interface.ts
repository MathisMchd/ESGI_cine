import { FilmStatus } from "./film-status.enum";


// Interface pour le film
export interface Film {
    id: number;
    title: string;
    director: string;
    cast: string[];
    genres: string[];
    year: number;
    duration: number;
    rating: number;
    language: string;
    synopsis: string;
    status: FilmStatus;
}