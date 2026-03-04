import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { StorageService } from 'src/storage/storage/storage.service';
import { QueryFilmDto } from './dto/query-film.dto';
import { Film } from './film.interface';
import { CONSTS } from 'src/common/consts';
import { CreateFilmDto } from './dto/create-film.dto';
import { FilmStatus } from './film-status.enum';
import { CustomException } from 'src/common/rule.exceptions';

@Injectable()
export class FilmService {
    constructor(private readonly storage: StorageService) { }


    // Liste paginée des films
    findAll(query: QueryFilmDto) {
        const { page = 1, limit = 10, genre, year, status, ratingSort, yearSort } = query;
        let data: Film[] = this.getFilms();
        // Filtres : genre, année, langue, statut (released / upcoming / cancelled)
        if (genre) {
            data = data.filter(c => c.genres.includes(genre));
        }

        if (year) {
            console.log("Filtering by year:", year);
            data = data.filter(c => c.year === year);
        }

        if (status) {
            data = data.filter(c => c.status === status);
        }

        //Tri par note (rating) et année
        if (ratingSort) {
            data = data.sort((a, b) => ratingSort === 'asc' ? a.rating - b.rating : b.rating - a.rating);
        }

        if (yearSort) {
            data = data.sort((a, b) => yearSort === 'asc' ? a.year - b.year : b.year - a.year);
        }

        const start = (page - 1) * limit;
        const end = start + limit;
        return {
            data: data.slice(start, end),
            total: data.length,
            page,
            limit
        };
    }

    // Récupération d'un film par ID
    getFilmById(id: number): Film {
        const film = this.getFilms().find(f => f.id === id);
        if (!film) {
            throw new NotFoundException(`Film with id ${id} not found`);
        }
        return film;
    }

    // Recherche par mot-clé dans le titre, le réalisateur ou le synopsis
    search(q: string): Film[] {
        const term = q.toLowerCase();
        return this.getFilms().filter(
            (f) =>
                f.title.toLowerCase().includes(term) ||
                f.director.toLowerCase().includes(term) ||
                f.synopsis.toLowerCase().includes(term),
        );
    }

    // Création d'un film
    create(film: CreateFilmDto): void {
        const films = this.getFilms();
        if (films.some(f => f.title.toLowerCase() === film.title.toLowerCase())) {
            throw new ConflictException(`Film with title ${film.title} already exists`);
        }
        const nexId = films.length > 0 ? Math.max(...films.map(f => f.id)) + 1 : 1;
        const newFilm: Film = { id: nexId, ...film };
        films.push(newFilm);
        this.storage.write(CONSTS.FILMS_FILE, films);
    }

    // Remplacement d'un film
    replace(id: number, body: CreateFilmDto) {
        const films = this.getFilms();
        const [index, _] = this.getIndexOfFilm(id, films);

        const replacedFilm: Film = { id, ...body };
        films[index] = replacedFilm;

        this.storage.write(CONSTS.FILMS_FILE, films);

        return replacedFilm;
    }


    update(id: number, body: Partial<CreateFilmDto>) {
        const films = this.getFilms();
        const [index, _] = this.getIndexOfFilm(id, films);
        const updatedFilm: Film = { ...films[index], ...body, id };
        films[index] = updatedFilm;
        this.storage.write(CONSTS.FILMS_FILE, films);
        return updatedFilm;
    }

    remove(id: number) {
        const films = this.getFilms();
        const [index, film] = this.getIndexOfFilm(id, films);
        if (film.status === FilmStatus.UPCOMING) {
            throw new CustomException(409, 'Un film upcoming ne peut pas être supprimé');
        }
        films.splice(index, 1);
        this.storage.write(CONSTS.FILMS_FILE, films);
    }


    // Récupérer l'index d'un film par son ID et le retourne
    // Lève une exception NotFoundException si le film n'existe pas
    private getIndexOfFilm(id: number, films: Film[]): [number, Film] {
        const index = films.findIndex(f => f.id === id);
        if (index === -1) {
            throw new NotFoundException(`Film with id ${id} not found`);
        }
        return [index, films[index]];
    }

    // Récupération des films
    private getFilms(): Film[] {
        try {
            return this.storage.read<Film[]>(CONSTS.FILMS_FILE);
        } catch (error) {
            console.error('Error reading film data:', error);
            throw new Error('Could not read film data');
        }   
    }
}
