import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NATS_DEFAULT_URL } from '@nestjs/microservices/constants';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.NATS,
      options: {
        servers: [NATS_DEFAULT_URL],
      },
    },
  );
  await app.listen(() => {
    console.log('Writer-service start');
  });
}
bootstrap();
