import { Expose, Transform } from 'class-transformer'
import { IsDefined, IsString } from 'class-validator'
import { ObjectId, Types } from 'mongoose'
import { AbstractEntity } from 'src/utils/BaseDBObject'

export class CreateRelationshipDto {
  @IsDefined()
  @IsString()
  type: string

  @IsDefined()
  @IsString()
  follower: string

  @IsDefined()
  @IsString()
  following: string
}

export class RelationshipEntity extends AbstractEntity {
  constructor(partial: Partial<RelationshipEntity>) {
    super()
    Object.assign(this, partial)
  }

  @Expose()
  @Transform(({ obj }) => obj._id)
  id: ObjectId

  @Expose()
  type: string

  @Expose()
  follower: string

  @Expose()
  following: string
}
