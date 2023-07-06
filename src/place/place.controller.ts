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
  ): Promise<PlaceEntity[]> {
    return this.placesService.findClubs(latitude, longitude, distance)
  }

  @Get(':id')
  findOneById(@Param('id') id: string): Promise<PlaceEntity> {
    console.log(id)
    return this.placesService.findOneById(id)
  }

  @Get(':name')
  findPlacesByName(@Param('name') name: string): Promise<PlaceEntity[]> {
    return this.placesService.findPlacesByName(name)
  }

  @Get('/filters')
  findByFilters(@Body() event: Partial<PlaceEntity>): Promise<PlaceEntity[]> {
    return this.placesService.findByFilters(event)
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
