import { Expose, Transform, Type } from 'class-transformer'
import { IsDefined, IsOptional } from 'class-validator'
import { PlaceEntity, PlaceEntityMinimize } from 'src/place/place.dto'
import { AbstractEntity, BaseDBObject } from 'src/utils/BaseDBObject'

export class CreateTopicDto {
  @IsDefined()
  name: string

  @IsDefined()
  cover: string

  @IsDefined()
  date: string

  @IsDefined()
  type: string

  @IsDefined()
  content: string[]

  @IsOptional()
  createdBy: string
}
export class TopicEntityMinimize extends AbstractEntity {
  constructor(partial: Partial<TopicEntity>) {
    super()
    Object.assign(this, partial)
  }

  @Expose()
  @Type(() => String)
  @Transform(({ obj }) => obj._id)
  id: string

  @Expose()
  name: string

  @Expose()
  cover: string

  @Expose()
  date: string
}

export class TopicEntity extends AbstractEntity {
  constructor(partial: Partial<TopicEntity>) {
    super()
    Object.assign(this, partial)
  }

  @Expose()
  name: string

  @Expose()
  cover: string

  @Expose()
  date: string

  @Expose()
  type: string

  @Expose()
  category: string

  @Expose()
  @Type(() => PlaceEntityMinimize)
  content: [PlaceEntityMinimize]
}
