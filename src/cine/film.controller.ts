import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Patch, Post, Put, Query } from '@nestjs/common';
import { FilmService } from './film.service';
import { ApiOperation } from '@nestjs/swagger/dist/decorators/api-operation.decorator';
import { ApiBody, ApiParam, ApiQuery, ApiResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { QueryFilmDto } from './dto/query-film.dto';
import { Film } from './film.interface';
import { FilmStatus } from './film-status.enum';
import { CONSTS } from 'src/common/consts';
import { CreateFilmDto } from './dto/create-film.dto';
import { AdminOnly } from 'src/common/decorators/admin.decorator';
import { Public } from 'src/common/decorators/public.decorators';

//@ApiSecurity('api-key')
@ApiTags('Films')
@Controller('films')
export class FilmController {
    constructor(private readonly filmService: FilmService) { }

    @ApiOperation({ summary: 'Liste paginée filtrée des films' })
    @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
    @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
    @ApiQuery({ name: 'genre', required: false, type: String, example: 'Crime' })
    @ApiQuery({ name: 'year', required: false, type: Number, example: 2010 })
    @ApiQuery({ name: 'status', required: false, enum: FilmStatus })
    @ApiQuery({ name: 'ratingSort', required: false, enum: ['asc', 'desc'] })
    @ApiQuery({ name: 'yearSort', required: false, enum: ['asc', 'desc'] })
    @ApiResponse({ status: 200, description: 'Liste retournée avec pagination' })
    @ApiResponse({ status: 400, description: 'Paramètres de requête invalides' })
    @ApiResponse({ status: 401, description: `Header x-api-key absent ou invalide` })
    @ApiResponse({ status: 500, description: 'Erreur interne du serveur' })
    @Public()
    @Get()
    findAll(@Query() query: QueryFilmDto) {
        return this.filmService.findAll(query);
    }

    @ApiOperation({ summary: 'Détails d\'un film.' })
    @ApiResponse({ status: 200, description: 'Détails du film trouvé' })
    @ApiResponse({ status: 404, description: 'Film non trouvé' })
    @ApiParam({ name: 'id', type: Number, description: 'ID du film à récupérer', example: 1 })
    @Get(':id')
    getFilmById(@Param('id', ParseIntPipe) id: number): Film {
        return this.filmService.getFilmById(id);
    }

    @ApiOperation({ summary: 'Recherche de films par mot-clé / Recherche full-text' })
    @ApiQuery({ name: 'q', required: true, type: String, example: 'The Batman' })
    @ApiResponse({ status: 200, description: 'La liste des films trouvés' })
    @ApiResponse({ status: 400, description: 'Paramètre de recherche invalide' })
    @ApiResponse({ status: 401, description: `Header x-api-key absent ou invalide` })
    @ApiResponse({ status: 500, description: 'Erreur interne du serveur' })
    @Public()
    @Get('search')
    search(@Query('q') q: string): Film[] {
        console.log("Recherche de films avec le mot-clé :", q);
        return this.filmService.search(q);
    }

    @ApiOperation({ summary: 'Créer un film' })
    @ApiResponse({ status: 201, description: 'Film créé avec succès' })
    @ApiResponse({ status: 401, description: `Header x-api-key absent ou invalide` })
    @ApiResponse({ status: 403, description: 'Accès réservé aux admins' })
    @ApiResponse({ status: 409, description: 'Conflit avec un film déjà existant' })
    @ApiBody({ type: CreateFilmDto, description: 'Données du film à créer' })
    @AdminOnly()
    @ApiSecurity('api-key')
    @Post()
    @HttpCode(201)
    create(@Body() film: CreateFilmDto): void {
        this.filmService.create(film);
    }


    @ApiOperation({ summary: 'Remplacer un film' })
    @ApiResponse({ status: 200, description: 'Film remplacé avec succès' })
    @ApiResponse({ status: 403, description: 'Accès réservé aux admins' })
    @ApiResponse({ status: 404, description: 'Film non trouvé' })
    @ApiParam({ name: 'id', type: Number, description: 'ID du film à remplacer', example: 1 })
    @ApiBody({ type: CreateFilmDto, description: 'Données du film à remplacer' })
    @AdminOnly()
    @ApiSecurity('api-key')
    @Put(':id')
    replace(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: CreateFilmDto
    ) {
        return this.filmService.replace(id, body);
    }

    @ApiOperation({ summary: 'Modifier partiellement un film' })
    @ApiResponse({ status: 200, description: 'Film mis à jour avec succès' })
    @ApiResponse({ status: 403, description: 'Accès réservé aux admins' })
    @ApiResponse({ status: 404, description: 'Film non trouvé' })
    @ApiParam({ name: 'id', type: Number, description: 'ID du film à modifier', example: 1 })
    @ApiBody({ type: CreateFilmDto, description: 'Données du film à modifier (partiellement)' })
    @AdminOnly()
    @ApiSecurity('api-key')
    @Patch(':id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: Partial<CreateFilmDto>
        ) {
        return this.filmService.update(id, body);
    }

    @ApiOperation({ summary: 'Supprimer un film' })
    @ApiResponse({ status: 204, description: 'Film supprimé avec succès' })
    @ApiResponse({ status: 403, description: 'Accès réservé aux admins' })
    @ApiResponse({ status: 404, description: 'Film non trouvé' })
    @ApiParam({ name: 'id', type: Number, description: 'ID du film à supprimer', example: 1 })
    @AdminOnly()
    @ApiSecurity('api-key')
    @HttpCode(204)
    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        this.filmService.remove(id);
    }
}
