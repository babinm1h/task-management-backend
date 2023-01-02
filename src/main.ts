import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as passport from 'passport';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const PORT = process.env.PORT || 7777;
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'https://warm-heliotrope-695459.netlify.app',
    ],
    credentials: true,
  });
  app.use(passport.initialize());

  await app.listen(PORT, () => console.log(`${PORT} started`));
}
bootstrap();
