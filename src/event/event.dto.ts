import { Expose, Transform, Type } from 'class-transformer'
import { IsDefined, IsOptional } from 'class-validator'
import { PlaceEntityMinimize } from 'src/place/place.dto'
import { UserEntityMinimize } from 'src/user/user.dto'
import { AbstractEntity, BaseDBObject } from 'src/utils/BaseDBObject'
import { GeoPointEntity } from 'src/utils/GeoPoint'
import {
  ArtistEntity,
  IArtist,
  IGeoPoint,
  ISlug,
  PartialPlace
} from 'src/utils/types'

export class CreateEventDto {
  @IsDefined()
  name: string

  @IsOptional()
  desc: string

  @IsOptional()
  cover: string

  @IsOptional()
  url: string

  @IsDefined()
  location: IGeoPoint

  @IsOptional()
  photos: string[]

  @IsDefined()
  beginAt: Date

  @IsOptional()
  endAt: Date

  @IsOptional()
  lineup: [IArtist]

  @IsOptional()
  minPrice: number

  @IsOptional()
  maxPrice: number

  @IsOptional()
  followersCount: number

  @IsDefined()
  slugs: ISlug

  @IsDefined()
  place: PartialPlace

  @IsDefined()
  categories: string[]

  @IsOptional()
  subCategories: string[]

  @IsOptional()
  active: boolean

  @IsOptional()
  private: boolean

  @IsDefined()
  createdBy: string
}

export class EventEntity extends BaseDBObject {
  constructor(partial: Partial<EventEntity>) {
    super()
    Object.assign(this, partial)
  }

  @Expose()
  name: string

  @Expose()
  desc: string

  @Expose()
  cover: string

  @Expose()
  url: string

  @Expose()
  @Type(() => GeoPointEntity)
  location: GeoPointEntity

  @Expose()
  photos: string[]

  @Expose()
  beginAt: Date

  @Expose()
  endAt: Date

  @Expose()
  @Type(() => ArtistEntity)
  lineup: [IArtist]

  @Expose()
  minPrice: number

  @Expose()
  maxPrice: number

  @Expose()
  distance: number

  @Expose()
  followersCount: number

  @Expose()
  slugs: ISlug

  @Expose()
  @Type(() => PartialPlaceEntity)
  place: PartialPlace

  @Expose()
  categories: string[]

  @Expose()
  subCategories: string[]

  @Expose()
  active: boolean

  @Expose()
  private: boolean

  @Expose()
  createdByModel: string

  @Expose()
  @Type(() => UserEntityMinimize || PlaceEntityMinimize)
  createdBy: UserEntityMinimize | PlaceEntityMinimize
}

export class PartialPlaceEntity {
  @Expose()
  address: string

  @Expose()
  name: string
}

export class EventEntityMinimize extends AbstractEntity {
  constructor(partial: Partial<EventEntity>) {
    super()
    Object.assign(this, partial)
  }

  @Expose()
  @Transform(({ obj }) => obj._id)
  id: string

  @Expose()
  name: string

  @Expose()
  desc: string

  @Expose()
  minPrice: number

  @Expose()
  cover: string

  @Expose()
  createdByModel: string

  @Expose()
  distance: number

  @Expose()
  @Type(() => GeoPointEntity)
  @Transform(({ value }) => value.coordinates)
  location: GeoPointEntity

  @Expose()
  beginAt: Date

  @Expose()
  @Type(() => PartialPlaceEntity)
  place: PartialPlace
}
