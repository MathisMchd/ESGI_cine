import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StorageModule } from './storage/storage.module';
import { FilmModule } from './cine/film.module';
import { AuthModule } from './auth/auth.module';
import { ThrottlerModule } from '@nestjs/throttler/dist/throttler.module';
import { ScalarModule } from './scalar/scalar.module';
import { SwaggerModule } from './swagger/swagger.module';

@Module({
  imports: [
    StorageModule,
    FilmModule,
    AuthModule,
    ThrottlerModule.forRoot({
      throttlers: [
        {
          name: 'default',
          ttl: 60000, // fenêtre de 1 minute en ms
          limit: 100, // max 100 requêtes par fenêtre par IP
        },
      ],
    }),
    ScalarModule,
    SwaggerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
