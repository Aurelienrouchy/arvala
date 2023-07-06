import { Module } from '@nestjs/common'
import { RelationshipsService } from './relationships.service'
import { MongooseModule } from '@nestjs/mongoose'
import { Relationship, RelationshipSchema } from './relationships.schema'
import { RelationshipsController } from './relationships.controller'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Relationship.name, schema: RelationshipSchema }
    ])
  ],
  controllers: [RelationshipsController],
  providers: [RelationshipsService],
  exports: [RelationshipsService]
})
export class RelationshipsModule {}
