import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { RelationshipsService } from './relationships.service'
import { CreateRelationshipDto, RelationshipEntity } from './relationships.dto'

@ApiTags('relationships')
@Controller('relationships')
export class RelationshipsController {
  constructor(private relationshipService: RelationshipsService) {}

  @Get(':id')
  getAll(@Param('id') userId: string): Promise<RelationshipEntity[]> {
    return this.relationshipService.findFollowingOfUser(userId)
  }

  @Post()
  create(
    @Body() relationshipDto: CreateRelationshipDto
  ): Promise<RelationshipEntity> {
    return this.relationshipService.create(relationshipDto)
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<void> {
    return this.relationshipService.deleteOne(id)
  }
}
