import { Expose, Transform, Type } from 'class-transformer'
import { Types } from 'mongoose'
import { AbstractEntity } from 'src/utils/BaseDBObject'
import { GeoPointEntity } from 'src/utils/GeoPoint'
import { PhoneType, ROLE } from './user.schema'

export class UserEntity extends AbstractEntity {
  constructor(partial: Partial<UserEntity>) {
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
  desc: string

  @Expose()
  role: ROLE

  @Expose()
  @Type(() => String)
  places: Types.ObjectId[]

  @Expose()
  @Type(() => String)
  followers: Types.ObjectId[]

  @Expose()
  @Type(() => GeoPointEntity)
  @Transform(({ value }) => value)
  location: GeoPointEntity

  @Expose()
  email: string

  @Expose()
  phone: PhoneType

  @Expose()
  website: Date

  @Expose()
  instagram: Date

  @Expose()
  facebook: number

  @Expose()
  @Type(() => String)
  events: Types.ObjectId[]

  @Expose()
  @Type(() => String)
  eventsLiked: Types.ObjectId[]

  @Expose()
  picture: string
}
