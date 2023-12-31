import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { EventsController } from './event.controller'
import { EventsService } from './event.service'
import { Event, EventSchema } from './event.schema'
import { User, UsersSchema } from 'src/user/user.schema'
import { Place, PlacesSchema } from 'src/place/place.schema'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Event.name, schema: EventSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UsersSchema }]),
    MongooseModule.forFeature([{ name: Place.name, schema: PlacesSchema }])
  ],
  controllers: [EventsController],
  providers: [EventsService],
  exports: [EventsService]
})
export class EventsModule {}
