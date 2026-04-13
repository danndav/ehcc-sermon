import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupOpenAPI(app: INestApplication): void {
  const description = 'API for EHCC Plus — Church Media & Sermon Streaming Platform';

  const options = new DocumentBuilder()
    .setTitle('EHCC Plus API')
    .setDescription(description)
    .setVersion('1.0')
    .addGlobalParameters({
      description: 'Trace ID for logging (optional)',
      in: 'header',
      name: 'x-trace-id',
      required: false,
      schema: {
        type: 'string',
      },
    })
    .addBearerAuth()
    .addServer('http://localhost:3000/api/v1')
    .addServer('https://4qim0uhipc.execute-api.us-east-1.amazonaws.com/dev/api/v1')
    .build();

  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup('docs', app, document, {
    jsonDocumentUrl: 'docs/json',
  });
}
