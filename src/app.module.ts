import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StorageModule } from './storage/storage.module';
import { FilmModule } from './cine/film.module';
import { AuthModule } from './auth/auth.module';
import { ThrottlerModule } from '@nestjs/throttler/dist/throttler.module';
import { ScalarModule } from './scalar/scalar.module';
import { SwaggerModule } from './swagger/swagger.module';
import { ThrottlerGuard } from '@nestjs/throttler';
import { ApiKeyGuard } from './common/guards/api-key/api-key.guard';
import { AdminGuard } from './common/guards/admin/admin.guard';
import { APP_GUARD } from '@nestjs/core';

@Module({
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_GUARD, useClass: ApiKeyGuard },
    { provide: APP_GUARD, useClass: AdminGuard },
  
  ],
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [
        {
          name: 'default',
          ttl: 60000, // 1 minute en ms
          limit: 100, // max 100 requêtes par fenêtre par IP
        },
      ],
    }),
    StorageModule,
    FilmModule,
    AuthModule,
    ScalarModule,
    SwaggerModule,
    
  ],
})
export class AppModule {}
