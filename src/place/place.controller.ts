import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseFloatPipe,
  ParseIntPipe,
  Post,
  Put,
  Query
} from '@nestjs/common'
import { PlacesService } from './place.service'
import { CreatePlaceDto, PlaceEntityMinimize } from './place.dto'
import { PlaceEntity } from './place.dto'
import { ApiTags } from '@nestjs/swagger'
import { PLACE_TYPES } from 'src/utils/types'

@ApiTags('place')
@Controller('place')
export class PlacesController {
  constructor(private placesService: PlacesService) {}

  // @Get('shotgun')
  // getShotgunPlace(): Promise<any> {
  //   return this.placesService.saveShotgunPlace()
  // }

  @Get('dice')
  getDicePlace(): Promise<any> {
    return this.placesService.saveDicePlaces()
  }

  @Get('near')
  findNear(
    @Query('lat') latitude: number,
    @Query('lng') longitude: number,
    @Query('distance') distance: number,
    @Query('types') types: string
  ): Promise<PlaceEntityMinimize[]> {
    return this.placesService.findNear(
      latitude,
      longitude,
      distance,
      JSON.parse(types)
    )
  }

  @Get('club')
  findClubs(
    @Query('lat') latitude: number,
    @Query('lng') longitude: number,
    @Query('distance') distance: number
  ): Promise<PlaceEntityMinimize[]> {
    return this.placesService.findClubs(latitude, longitude, distance)
  }
  @Get('bars')
  getBars(
    @Query('lat', ParseFloatPipe) lat: number,
    @Query('lng', ParseFloatPipe) lng: number,
    @Query('types') types?: string
  ): Promise<PlaceEntityMinimize[]> {
    return this.placesService.findBars(lat, lng, types)
  }

  @Get('name')
  findByName(@Query('name') name: string): Promise<PlaceEntityMinimize[]> {
    return this.placesService.getByName(name)
  }

  @Get('filters')
  findByFilters(@Body() event: Partial<PlaceEntity>): Promise<PlaceEntity[]> {
    return this.placesService.findByFilters(event)
  }

  @Get(':id')
  findOneById(@Param('id') id: string): Promise<PlaceEntity> {
    return this.placesService.findOneById(id)
  }

  @Get()
  findAllPlaces(): Promise<PlaceEntity[]> {
    return this.placesService.find()
  }

  @Post()
  create(@Body() dto: CreatePlaceDto): Promise<PlaceEntity> {
    return this.placesService.create(dto)
  }

  @Put(':id')
  updateEvent(
    @Body() place: Partial<CreatePlaceDto>,
    @Param('id') id: string
  ): Promise<PlaceEntity> {
    return this.placesService.updateOneById(id, place)
  }

  @Delete(':id')
  deleteEvent(@Param('id') id: string) {
    return this.placesService.deleteOneById(id)
  }
}
