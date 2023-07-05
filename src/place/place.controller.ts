import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query
} from '@nestjs/common'
import { PlacesService } from './place.service'
import { CreatePlaceDto } from './place.dto'
import { PlaceEntity } from './place.dto'

@Controller('place')
export class PlacesController {
  constructor(private placesService: PlacesService) {}

  @Get('near?')
  findNear(
    @Query('distance') distance: string,
    @Query('long') long: string,
    @Query('lat') lat: string
  ): Promise<PlaceEntity[]> {
    return this.placesService.findNear(Number(distance), [
      Number(long),
      Number(lat)
    ])
  }

  @Get(':id')
  findOneById(@Param('id') id: string): Promise<PlaceEntity> {
    console.log({ id })
    return this.placesService.findOneById(id)
  }

  @Get()
  findPlacesByName(@Query() query: { name: string }): Promise<PlaceEntity[]> {
    return this.placesService.findPlacesByName(query.name)
  }

  @Post()
  create(@Body() dto: CreatePlaceDto): Promise<PlaceEntity> {
    return this.placesService.create(dto)
  }

  // @Put(':id')
  // updateEvent(
  //   @Body() event: Partial<UpdateEventDto>,
  //   @Param('id') id: string
  // ): Promise<Event> {
  //   return this.eventsService.updateOneById(id, event)
  // }

  @Delete(':id')
  deleteEvent(@Param('id') id: string): Promise<PlaceEntity> {
    return this.placesService.deleteOneById(id)
  }
}
