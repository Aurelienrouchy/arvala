import { Expose, Transform, Type } from 'class-transformer'
import { AbstractEntity } from 'src/utils/BaseDBObject'
import { GeoPointEntity } from 'src/utils/GeoPoint'
import { ROLE } from './user.schema'
import { IsOptional } from 'class-validator'
import { IPlace, ISlug, IContacts, ISocial, IEvent } from 'src/utils/types'

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
  @Type(() => GeoPointEntity)
  @Transform(({ value }) => value)
  location: GeoPointEntity

  @Expose()
  cover: string

  @Expose()
  address: string

  @Expose()
  role: ROLE

  @Expose()
  places: Pick<IPlace, 'id' | 'name' | 'address'>[]

  @Expose()
  followersCount: number

  @IsOptional()
  slugs: ISlug

  @Expose()
  contacts: IContacts

  @Expose()
  social: ISocial

  @Expose()
  events: Pick<
    IEvent,
    'id' | 'name' | 'place' | 'cover' | 'beginAt' | 'minPrice'
  >[]
}
