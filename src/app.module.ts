import { RelationshipsModule } from './relationships/relationships.module'
import { PlaceModule } from './place/place.module'
import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { EventsModule } from './event/event.module'
import { UserModule } from './user/user.module'
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from './auth/auth.module'
import Joi from 'joi'

@Module({
  imports: [
    RelationshipsModule,
    PlaceModule,
    UserModule,
    EventsModule,
    MongooseModule.forRoot(
      'mongodb+srv://aurelien:Prout123.!@cluster0.mywprwj.mongodb.net/cosh?retryWrites=true&w=majority&ssl=true',
      { autoIndex: true }
    ),
    AuthModule,
    // PassportModule.register({ defaultStrategy: 'google' }),
    // JwtModule.registerAsync({
    //   useFactory: () => ({
    //     secret: process.env.JWT_SECRET,
    //     signOptions: { expiresIn: '7d' }
    //   })
    // }),
    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvFile: true,
      validationSchema: Joi.object({
        // EMAIL_SERVICE: Joi.string().required(),
        // EMAIL_USER: Joi.string().required(),
        // EMAIL_PASSWORD: Joi.string().required()
      })
    })
  ]
})
export class AppModule {}
