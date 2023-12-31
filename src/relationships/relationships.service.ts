import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException
} from '@nestjs/common'
import { Relationship, RelationshipDocument } from './relationships.schema'
import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { CreateRelationshipDto, RelationshipEntity } from './relationships.dto'
import { plainToInstance } from 'class-transformer'

@Injectable()
export class RelationshipsService {
  constructor(
    @InjectModel(Relationship.name)
    private relationshipRepository: Model<RelationshipDocument>
  ) {}

  async create(
    relationshipDto: CreateRelationshipDto
  ): Promise<RelationshipEntity> {
    const isExist = await this.relationshipRepository
      .findOne(relationshipDto)
      .exec()

    if (isExist) {
      throw new HttpException(`Fav already exist`, HttpStatus.CONFLICT)
    }

    const savedRelationship = await new this.relationshipRepository(
      relationshipDto
    ).save()

    const re = await savedRelationship.populate('following')

    return plainToInstance(RelationshipEntity, re, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true
    })
  }

  async deleteOne(id: string): Promise<void> {
    const result = await this.relationshipRepository
      .findByIdAndDelete(id)
      .exec()

    if (!result) {
      throw new NotFoundException(`Relationship with ID ${id} not found`)
    }
  }

  async findFollowingOfUser(userId: string): Promise<RelationshipEntity[]> {
    const res = await this.relationshipRepository
      .find({ follower: userId })
      .populate('following')

    return plainToInstance(RelationshipEntity, res, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true
    })
  }
}
