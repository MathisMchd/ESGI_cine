# Sujet d'examen — Cours NestJS M2 ESGI IW 2026

En vous basant sur les connaissances acquises pendant le cours et sur l'API Manga créée pendant les TP, construisez une API REST à destination de professionnels du développement logiciel.

Choisissez un sujet parmi les trois ci-dessous. Une fois votre cahier des charges déterminé, créez un dépôt git et invitez **@NicoHersant** en droit de lecture (ou dépôt public). Votre travail sera livré à la fin du cours.

---

## Thème A — CineAPI (catalogue de films)

**Contexte** : vous êtes prestataire pour une startup qui veut exposer une API de données cinéma à des développeurs tiers (applications mobiles, sites de critique, widgets).
Modèle : type TMDB API.

**Entité principale : Film**
```json
{
  "id": 1,
  "title": "Inception",
  "director": "Christopher Nolan",
  "cast": ["Leonardo DiCaprio", "Joseph Gordon-Levitt"],
  "genres": ["Sci-Fi", "Thriller"],
  "year": 2010,
  "duration": 148,
  "rating": 8.8,
  "language": "en",
  "synopsis": "...",
  "status": "released"
}
```

**Spécificités business :**
- Filtres : genre, année, langue, statut (`released` / `upcoming` / `cancelled`)
- Tri par note (`rating`) et année
- Recherche sur titre, réalisateur, synopsis
- Un film `upcoming` ne peut pas être supprimé (→ 409 avec message explicite)

---

#### Routes et décorateurs de méthode

| Méthode | Route | Décorateurs attendus |
|---|---|---|
| `GET /films` | Liste paginée filtrée | `@Get()` `@ApiOperation()` `@ApiQuery()` ×5 (page, limit, genre, status, language) `@ApiResponse()` ×3 (200, 401, 400) |
| `GET /films/search` | Recherche full-text | `@Get('search')` `@ApiOperation()` `@ApiQuery({ name: 'q', required: true })` `@ApiResponse()` ×2 |
| `GET /films/:id` | Détail d'un film | `@Get(':id')` `@ApiOperation()` `@ApiParam()` `@ApiResponse()` ×2 (200, 404) |
| `POST /films` | Créer un film | `@Post()` `@HttpCode(201)` `@AdminOnly()` `@ApiOperation()` `@ApiResponse()` ×3 (201, 403, 409) |
| `PUT /films/:id` | Remplacer un film | `@Put(':id')` `@AdminOnly()` `@ApiOperation()` `@ApiParam()` `@ApiResponse()` ×3 |
| `PATCH /films/:id` | Modifier partiellement | `@Patch(':id')` `@AdminOnly()` `@ApiOperation()` `@ApiParam()` `@ApiResponse()` ×2 |
| `DELETE /films/:id` | Supprimer (interdit si `upcoming`) | `@Delete(':id')` `@HttpCode(204)` `@AdminOnly()` `@ApiOperation()` `@ApiParam()` `@ApiResponse()` ×3 (204, 404, 409) |


#### Décorateurs personnalisés à implémenter
- `@Public()` — exempte une route du guard global (route `GET /films` et `GET /films/search` lisibles sans authentification si vous le souhaitez)
- `@AdminOnly()` — restreint l'accès aux routes d'écriture

---

## Thème B — JobAPI (tableau d'offres d'emploi)

**Contexte** : vous exposez une API à destination d'agrégateurs d'offres d'emploi (type LinkedIn, Indeed). Le produit est B2B : les recruteurs ont un compte admin, les agrégateurs ont une clef API user.

**Entité principale : JobOffer**
```json
{
  "id": 1,
  "title": "Développeur NestJS Senior",
  "company": "Acme Corp",
  "location": "Paris",
  "remote": "hybrid",
  "contract": "CDI",
  "salary": { "min": 50000, "max": 65000, "currency": "EUR" },
  "skills": ["NestJS", "TypeScript", "Docker"],
  "status": "open",
  "publishedAt": "2026-01-15T09:00:00.000Z",
  "description": "..."
}
```

**Spécificités business :**
- Filtres : `remote` (remote / hybrid / onsite), `contract`, `location`, `skills`, `status` (open / closed / draft)
- Les offres `draft` ne sont visibles qu'avec un rôle admin
- Un user peut lire uniquement les offres `open`
- Fermer une offre (`status: closed`) = PATCH spécifique — pas de DELETE si `open`

---

### Annotations NestJS attendues

#### `JobOffersController` — décorateurs de classe
```ts
@ApiTags('JobOffers')
@ApiSecurity('api-key')
@Controller('job-offers')
```

#### Routes et décorateurs de méthode

| Méthode | Route | Décorateurs attendus |
|---|---|---|
| `GET /job-offers` | Liste filtrée (scope selon rôle) | `@Get()` `@ApiOperation()` `@ApiQuery()` ×5 (status, remote, contract, location, skills) `@ApiResponse()` ×3 (200, 401, 400) |
| `GET /job-offers/:id` | Détail (filtré si user) | `@Get(':id')` `@ApiOperation()` `@ApiParam()` `@ApiResponse()` ×3 (200, 403, 404) |
| `POST /job-offers` | Créer une offre | `@Post()` `@HttpCode(201)` `@AdminOnly()` `@ApiOperation()` `@ApiResponse()` ×3 (201, 403, 409) |
| `PUT /job-offers/:id` | Remplacer une offre | `@Put(':id')` `@AdminOnly()` `@ApiOperation()` `@ApiParam()` `@ApiResponse()` ×3 |
| `PATCH /job-offers/:id` | Modifier partiellement | `@Patch(':id')` `@AdminOnly()` `@ApiOperation()` `@ApiParam()` `@ApiResponse()` ×2 |
| `PATCH /job-offers/:id/close` | Fermer une offre | `@Patch(':id/close')` `@AdminOnly()` `@ApiOperation()` `@ApiParam()` `@ApiResponse()` ×3 (200, 403, 404) |
| `DELETE /job-offers/:id` | Supprimer (interdit si `open`) | `@Delete(':id')` `@HttpCode(204)` `@AdminOnly()` `@ApiOperation()` `@ApiParam()` `@ApiResponse()` ×3 (204, 403, 409) |


#### Décorateurs personnalisés à implémenter
- `@Public()` — si vous souhaitez exposer certaines routes sans authentification
- `@AdminOnly()` — restreint les routes d'écriture et les offres `draft` à la lecture

> **Note sur le filtrage par rôle** : dans le guard ou dans le service, lisez `req.user.role` pour distinguer `admin` (voit tout) et `user` (voit uniquement les offres `open`). L'annotation `@Request()` est le point d'entrée pour récupérer cet objet dans le contrôleur.

---

## Thème C — GameStoreAPI (catalogue de jeux vidéo)

**Contexte** : API backend pour un store de jeux vidéo indépendant (type Steam). Les développeurs de jeux ont un compte admin, les intégrateurs externes (comparateurs de prix, applications de gestion de collection) ont une clef user.

**Entité principale : Game**
```json
{
  "id": 1,
  "title": "Hollow Knight",
  "studio": "Team Cherry",
  "genres": ["Metroidvania", "Action", "Platformer"],
  "platforms": ["PC", "Switch", "PS4"],
  "releaseDate": "2017-02-24",
  "price": 14.99,
  "metacritic": 90,
  "stock": "available",
  "dlcs": ["Godmaster", "Lifeblood"],
  "synopsis": "..."
}
```

**Spécificités business :**
- Filtres : genre, platform, stock (`available` / `out_of_stock` / `discontinued`)
- Tri par prix et note Metacritic
- Un jeu `discontinued` ne peut pas repasser en `available` (→ 422)
- Un user ne peut pas voir les jeux `discontinued`

---

#### Routes et décorateurs de méthode

| Méthode | Route | Décorateurs attendus |
|---|---|---|
| `GET /games` | Liste filtrée + triée | `@Get()` `@ApiOperation()` `@ApiQuery()` ×5 (genre, platform, stock, sortBy, order) `@ApiResponse()` ×3 (200, 401, 400) |
| `GET /games/search` | Recherche full-text | `@Get('search')` `@ApiOperation()` `@ApiQuery({ name: 'q', required: true })` `@ApiResponse()` ×2 |
| `GET /games/:id` | Détail (masqué si `discontinued` et user) | `@Get(':id')` `@ApiOperation()` `@ApiParam()` `@ApiResponse()` ×3 (200, 403, 404) |
| `POST /games` | Créer un jeu | `@Post()` `@HttpCode(201)` `@AdminOnly()` `@ApiOperation()` `@ApiResponse()` ×3 (201, 403, 409) |
| `PUT /games/:id` | Remplacer un jeu | `@Put(':id')` `@AdminOnly()` `@ApiOperation()` `@ApiParam()` `@ApiResponse()` ×3 |
| `PATCH /games/:id` | Modifier partiellement | `@Patch(':id')` `@AdminOnly()` `@ApiOperation()` `@ApiParam()` `@ApiResponse()` ×3 (200, 404, 422) |
| `DELETE /games/:id` | Supprimer | `@Delete(':id')` `@HttpCode(204)` `@AdminOnly()` `@ApiOperation()` `@ApiParam()` `@ApiResponse()` ×2 (204, 404) |

#### Décorateurs personnalisés à implémenter
- `@Public()` — si certaines routes de lecture sont accessibles sans clef
- `@AdminOnly()` — sur toutes les routes d'écriture

> **Note sur la règle 422** : lancez une `UnprocessableEntityException` depuis le service quand un PATCH tente de faire repasser un jeu `discontinued` en `available`. Documentez cette réponse avec `@ApiResponse({ status: 422, description: 'Transition de statut interdite' })`.

---

## Exigences communes à tous les sujets

### Module Auth (identique au TP manga)

| Route | Annotations requises |
|---|---|
| `POST /auth/register` | `@Public()` `@Post('register')` `@HttpCode(201)` `@ApiOperation()` `@ApiResponse()` ×3 |
| `GET /auth/me` | `@Get('me')` `@ApiOperation()` `@ApiResponse()` ×3 `@ApiHeader()` |
| `POST /auth/regenerate-key` | `@Post('regenerate-key')` `@ApiOperation()` `@ApiResponse()` ×2 |
| `DELETE /auth/account` | `@Delete('account')` `@HttpCode(204)` `@ApiOperation()` `@ApiResponse()` ×2 |

### Guards à implémenter
- **`ApiKeyGuard`** (global) : lit le header `X-API-Key`, attache `req.user`, lève `401` si absent, `403` si invalide ; respecte `@Public()` via `Reflector`
- **`AdminGuard`** (ou intégré dans `ApiKeyGuard`) : lit `req.user.role`, lève `403` si non-admin ; activé par `@AdminOnly()` via `Reflector`

### RegisterDto
```ts
// email
@ApiProperty({ example: 'dev@acme.com' })
@IsEmail()
@IsNotEmpty()
```

### Documentation Swagger
Chaque route doit exposer **a minima** :
- `@ApiOperation({ summary: '...', description: '...' })`
- `@ApiResponse()` pour chaque code HTTP possible (200/201, 400, 401, 403, 404, 409/422)
- `@ApiParam()` sur toute route avec `:id`
- `@ApiQuery()` sur toute route avec des query params
- `@ApiProperty()` sur chaque champ de DTO
