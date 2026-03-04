import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupGlobalValidation } from './common/extensions/validation.extension';
import { setupScalarDocs } from './scalar/scalar.config';
import { setupSwagger } from './swagger/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.enableCors();

  // Pipelines de validation cf common/extensions/validation.extension.ts
  setupGlobalValidation(app);

  // Swagger cf module swagger/swagger.config.ts
  setupSwagger(app);

  // Scalar cf module scalar/scalar.config.ts
  await setupScalarDocs(app);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
