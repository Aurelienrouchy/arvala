import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common'
import { TopicsService } from './topic.service'
import { ApiTags } from '@nestjs/swagger'
import { TopicEntity, TopicEntityMinimize } from './topic.dto'

@ApiTags('topic')
@Controller('topic')
export class TopicsController {
  constructor(private topicsService: TopicsService) {}

  @Get('bar')
  findBarsTopics(): Promise<TopicEntityMinimize[]> {
    return this.topicsService.findBarTopics()
  }

  @Get('club')
  findClubsTopics(): Promise<TopicEntityMinimize[]> {
    return this.topicsService.findClubTopics()
  }

  @Get(':id')
  findOneById(@Param('id') id: string): Promise<TopicEntity> {
    return this.topicsService.findOneById(id)
  }

  @Post()
  create(@Body() createTopicDto): Promise<TopicEntity> {
    return this.topicsService.create(createTopicDto)
  }

  @Put(':id')
  updateEvent(
    @Body() event: Partial<TopicEntity>,
    @Param('id') id: string
  ): Promise<TopicEntity> {
    return this.topicsService.updateOneById(id, event)
  }

  @Delete(':id')
  deleteEvent(@Param('id') id: string): Promise<TopicEntity> {
    return this.topicsService.deleteOneById(id)
  }
}
