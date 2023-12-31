import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { JwtStrategy } from './strategies/accessToken.strategy'
import { User, UsersSchema } from 'src/user/user.schema'
import { MongooseModule } from '@nestjs/mongoose'
import { RefreshToken, RefreshTokenSchema } from './auth.schema'
import { UserService } from 'src/user/user.service'
import { PassportModule } from '@nestjs/passport'
import { AppleStrategy } from './strategies/apple.strategy'

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'bearer' }),
    MongooseModule.forFeature([
      { name: User.name, schema: UsersSchema },
      { name: RefreshToken.name, schema: RefreshTokenSchema }
    ])
  ],
  controllers: [AuthController],
  providers: [AppleStrategy, UserService, AuthService, JwtStrategy],
  exports: [AuthService]
})
export class AuthModule {}
