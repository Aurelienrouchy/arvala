import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards
} from '@nestjs/common'
import { EventsService } from './event.service'
import { CreateEventDto, EventEntity } from './event.dto'
import { Event } from './event.schema'
import JwtAuthenticationGuard from 'src/auth/jwt-authentication.guard'
import RequestWithUser from 'src/auth/requestWithUser.interface'
import { Types } from 'mongoose'

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

  @Get(':id')
  findOneById(@Param('id') id: string): Promise<EventEntity> {
    return this.eventsService.findOneById(id)
  }

  @Get(':id')
  findByUserId(@Param('id') id: string): Promise<EventEntity> {
    return this.eventsService.findOneById(id)
  }

  @Post()
  create(@Body() createEventDto: CreateEventDto): Promise<EventEntity> {
    return this.eventsService.create(createEventDto)
  }

  @Get('follow/:id')
  @UseGuards(JwtAuthenticationGuard)
  follow(
    @Param('id') id: string,
    @Req() request: RequestWithUser
  ): Promise<EventEntity> {
    return this.eventsService.follow(request.user, id)
  }

  @Get('unfollow/:id')
  @UseGuards(JwtAuthenticationGuard)
  unfollow(
    @Param('id') id: string,
    @Req() request: RequestWithUser
  ): Promise<EventEntity> {
    return this.eventsService.unFollow(request.user, id)
  }

  // @Put(':id')
  // updateEvent(
  //   @Body() event: Partial<UpdateEventDto>,
  //   @Param('id') id: string
  // ): Promise<Event> {
  //   return this.eventsService.updateOneById(id, event)
  // }

  // @Delete(':id')
  // deleteEvent(@Param('id') id: string): Promise<Event> {
  //   return this.eventsService.deleteOneById(id)
  // }
}
