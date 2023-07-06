import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { EventsController } from './event.controller'
import { EventsService } from './event.service'
import { Event, EventSchema } from './event.schema'
import { User, UsersSchema } from 'src/user/user.schema'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Event.name, schema: EventSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UsersSchema }])
  ],
  controllers: [EventsController],
  providers: [EventsService],
  exports: [EventsService]
})
export class EventsModule {}
