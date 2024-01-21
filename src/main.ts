import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import * as dotenv from 'dotenv'
import bodyParser from 'body-parser'
dotenv.config()

import 'reflect-metadata'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { ServiceAccount, initializeApp } from 'firebase-admin/app'
import serviceAccount from './evenly-74fd5-firebase-adminsdk-tw1hy-ed9e7961ff.json'
import { credential } from 'firebase-admin'

const options = {
  origin: '*',
  credentials: true
}

initializeApp({
  credential: credential.cert(serviceAccount as ServiceAccount)
})

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
  app.use(bodyParser.urlencoded({ extended: true }))
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
