import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import * as dotenv from 'dotenv'
dotenv.config()

import 'reflect-metadata'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

const options = {
  origin: '*',
  credentials: true
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true
      // exceptionFactory: (validationErrors: ValidationError[] = []) => {
      //   console.error(JSON.stringify(validationErrors))
      //   return new BadRequestException(validationErrors)
      // }
    })
  )
  app.enableCors(options)

  const config = new DocumentBuilder()
    .setTitle('Arvala')
    .setDescription('Arvala for Cosh API')
    .setVersion('1.0')
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document)

  await app.listen(3000)
}
bootstrap()
