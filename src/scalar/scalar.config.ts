import { INestApplication } from '@nestjs/common';

export async function setupScalarDocs(app: INestApplication): Promise<void> {
  const { apiReference } = await import('@scalar/nestjs-api-reference');
  app.use(
    '/api/docs',
    apiReference({
      url: '/api/docs-json',
    }),
  );
}