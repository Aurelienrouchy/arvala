import { PlacesService } from './place.service'
import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Place, PlacesSchema } from './place.schema'
import { PlacesController } from './place.controller'
import { EventSchema } from 'src/event/event.schema'
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Place.name, schema: PlacesSchema },
      { name: Event.name, schema: EventSchema }
    ]),
    CloudinaryModule
  ],
  controllers: [PlacesController],
  providers: [PlacesService],
  exports: [PlacesService]
})
export class PlaceModule {}
