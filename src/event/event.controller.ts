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
  Query,
  Req,
  UseGuards
} from '@nestjs/common'
import { EventsService } from './event.service'
import { EventEntity, EventEntityMinimize } from './event.dto'
import JwtAuthenticationGuard from 'src/auth/jwt-authentication.guard'
import RequestWithUser from 'src/auth/requestWithUser.interface'
import { ApiTags } from '@nestjs/swagger'
import { PlaceEntityMinimize } from 'src/place/place.dto'
import { UserEntityMinimize } from 'src/user/user.dto'
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

  @Get('concerts')
  getConcertsEvents(
    @Query('lat', ParseFloatPipe) lat: number,
    @Query('lng', ParseFloatPipe) lng: number,
    @Query('types') types?: string,
    @Query('start') start?: string,
    @Query('end') end?: string
  ): Promise<EventEntityMinimize[]> {
    return this.eventsService.getEvents(
      [lat, lng],
      start,
      end,
      types,
      'concert'
    )
  }

  @Get('clubs')
  getClubsEvents(
    @Query('lat', ParseFloatPipe) lat: number,
    @Query('lng', ParseFloatPipe) lng: number,
    @Query('types') types?: string,
    @Query('start') start?: string,
    @Query('end') end?: string
  ): Promise<EventEntityMinimize[]> {
    return this.eventsService.getEvents([lat, lng], start, end, types, 'club')
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
  @Get('search')
  search(
    @Query('q') q: string,
    @Query('start') start?: string,
    @Query('end') end?: string
  ): Promise<EventEntityMinimize[]> {
    return this.eventsService.searchEvents(q, start, end)
  }

  @Get('filter')
  findByFilters(@Body() filters: Partial<EventEntity>): Promise<EventEntity[]> {
    return this.eventsService.findByFilters(filters)
  }

  @Get('dice')
  recordDiceEvents() {
    return this.eventsService.recordDiceEvents()
  }

  @Get('shotgun')
  recordShotgunEvents() {
    return this.eventsService.recordShotgunEvents()
  }

  @Get('name')
  findByName(@Query('name') name: string): Promise<EventEntityMinimize[]> {
    return this.eventsService.getByName(name)
  }

  @Get(':id')
  findOneById(@Param('id') id: string): Promise<EventEntity> {
    return this.eventsService.findOneById(id)
  }

  @Get()
  findAllPlaces() {
    return this.eventsService.deleteEventsInPlace()
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
