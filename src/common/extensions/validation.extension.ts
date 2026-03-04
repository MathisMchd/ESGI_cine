
import { INestApplication, ValidationPipe } from '@nestjs/common';


// Pipelines pour les validations
export function setupGlobalValidation(app: INestApplication): void {
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
}