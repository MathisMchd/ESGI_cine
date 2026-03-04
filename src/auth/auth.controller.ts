import { Body, Controller, Delete, Get, HttpCode, Post, Req } from '@nestjs/common';
import type { Request } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { Public } from 'src/common/decorators/public.decorators';
import { ApiBody, ApiOperation, ApiParam, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { AdminOnly } from 'src/common/decorators/admin.decorator';

@ApiTags('Users et admin')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Public()
    @ApiOperation({ summary: 'Enregistrer un nouvel utilisateur' })
    @ApiBody({
        type: RegisterDto,
        description: 'Informations de l\'utilisateur à enregistrer',
    })
    @Post('register')
    register(@Body() body: RegisterDto) {
        console.log("Body", body)
        return this.authService.register(body.email);
    }

    @ApiOperation({ summary: 'Récupérer les informations de l\'utilisateur' })
    @Get('me')
    getMe(@Req() req: Request) {
        const user = (req as any).user;
        return this.authService.getMe(user.apiKey);
    }

    @ApiOperation({ summary: 'Régénérer la clé API' })
    @Post('regenerate-key')
    regenerateKey(@Req() req: Request) {
        return this.authService.regenerateKey((req as any).user.apiKey);
    }

    @ApiOperation({ summary: 'Supprimer le compte de l\'utilisateur' })
    @AdminOnly()
    @Delete('account')
    @HttpCode(204)
    deleteAccount(@Req() req: Request) {
        this.authService.deleteAccount((req as any).user.apiKey);
    }
}
