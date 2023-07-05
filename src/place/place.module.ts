import { PlacesService } from './place.service'
import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Place, PlacesSchema } from './place.schema'
import { PlacesController } from './place.controller'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Place.name, schema: PlacesSchema }])
  ],
  controllers: [PlacesController],
  providers: [PlacesService]
})
export class PlaceModule {}
