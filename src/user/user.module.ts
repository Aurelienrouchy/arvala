import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { UserController } from './user.controller'
import { UserService } from './user.service'
import { User, UsersSchema } from './user.schema'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UsersSchema }])
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}
