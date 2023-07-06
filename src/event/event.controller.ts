import {
  Body,
  Controller,
  Get,
  Param,
  ParseFloatPipe,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
  UseGuards
} from '@nestjs/common'
import { EventsService } from './event.service'
import { EventEntity, EventEntityMinimize } from './event.dto'
import JwtAuthenticationGuard from 'src/auth/jwt-authentication.guard'
import RequestWithUser from 'src/auth/requestWithUser.interface'
import { ApiTags } from '@nestjs/swagger'
@ApiTags('event')
@Controller('event')
export class EventsController {
  constructor(private eventsService: EventsService) {}

  @Get('near')
  findNear(
    @Query('distance') distance: string,
    @Query('long') long: string,
    @Query('lat') lat: string
  ) {
    return this.eventsService.findNear(Number(distance), [
      Number(long),
      Number(lat)
    ])
  }

  @Get('populars')
  getMostPopularEventsNearUser(
    @Query('lat', ParseFloatPipe) lat: number,
    @Query('lng', ParseFloatPipe) lng: number
  ): Promise<EventEntityMinimize[]> {
    return this.eventsService.getMostPopularEventsNearUser(lat, lng)
  }

  @Get('news')
  getNewEvents(
    @Query('lat', ParseFloatPipe) lat: number,
    @Query('lng', ParseFloatPipe) lng: number,
    @Query('limit', ParseIntPipe) limit: number
  ): Promise<EventEntityMinimize[]> {
    return this.eventsService.getNewEvents(lat, lng, limit)
  }

  @Get('today')
  getDailyEvents(
    @Query('lat', ParseFloatPipe) lat: number,
    @Query('lng', ParseFloatPipe) lng: number,
    @Query('distance', ParseIntPipe) distance: number,
    @Query('filters') filters: string[],
    @Query('limit', ParseIntPipe) limit: number
  ): Promise<EventEntityMinimize[]> {
    return this.eventsService.getDailyEvents(distance, [lat, lng], limit)
  }

  @Get('weekly')
  getWeeklyEvents(
    @Query('lat', ParseFloatPipe) lat: number,
    @Query('lng', ParseFloatPipe) lng: number,
    @Query('distance', ParseFloatPipe) distance: number,
    @Query('limit', ParseIntPipe) limit: number
  ): Promise<EventEntityMinimize[]> {
    return this.eventsService.getWeeklyEvents(distance, [lat, lng], limit)
  }

  @Get()
  findByName(@Query('name') name: string): Promise<EventEntityMinimize[]> {
    return this.eventsService.getByName(name)
  }

  @Get(':id')
  findOneById(@Param('id') id: string): Promise<EventEntity> {
    return this.eventsService.findOneById(id)
  }

  @Get()
  findByFilters(@Body() filters: Partial<EventEntity>): Promise<EventEntity[]> {
    return this.eventsService.findByFilters(filters)
  }

  @Get()
  findAllPlaces(): Promise<EventEntity[]> {
    return this.eventsService.findAll()
  }

  @Post()
  create(@Body() createEventDto): Promise<EventEntity> {
    return this.eventsService.create(createEventDto)
  }

  @Put('follow/:id')
  @UseGuards(JwtAuthenticationGuard)
  follow(
    @Param('id') id: string,
    @Req() request: RequestWithUser
  ): Promise<EventEntity> {
    return this.eventsService.follow(request.user, id)
  }

  @Put('unfollow/:id')
  @UseGuards(JwtAuthenticationGuard)
  unfollow(
    @Param('id') id: string,
    @Req() request: RequestWithUser
  ): Promise<EventEntity> {
    return this.eventsService.unFollow(request.user, id)
  }

  @Put(':id')
  updateEvent(
    @Body() event: Partial<EventEntity>,
    @Param('id') id: string
  ): Promise<EventEntity> {
    return this.eventsService.updateOneById(id, event)
  }

  // @Delete(':id')
  // deleteEvent(@Param('id') id: string): Promise<Event> {
  //   return this.eventsService.deleteOneById(id)
  // }
}
