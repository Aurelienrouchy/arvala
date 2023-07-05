import { Expose, Transform, Type } from 'class-transformer'
import { IsDefined, IsEmail, IsOptional, IsString } from 'class-validator'
import { AbstractEntity, BaseDBObject } from 'src/utils/BaseDBObject'
import { GeoPoint, GeoPointEntity } from 'src/utils/GeoPoint'
import { PRICE_RANGE } from './place.schema'

export class CreatePlaceDto extends AbstractEntity {
  @IsDefined()
  @IsString()
  name: string

  @IsDefined()
  @IsString()
  desc: string

  @IsDefined()
  location: GeoPoint

  @IsDefined()
  @IsString()
  image: string

  @IsDefined()
  openHours: number[][]

  @IsDefined()
  @IsString()
  placeId: string

  @IsOptional()
  @IsEmail()
  email: string

  @IsDefined()
  priceRange: PRICE_RANGE

  @IsOptional()
  categories?: string[]

  @IsOptional()
  phone?: string

  @IsOptional()
  website?: string

  @IsOptional()
  facebook?: string

  @IsOptional()
  instagram?: string
}

export class GooglePlaceEntity extends AbstractEntity {
  constructor(partial: Partial<GooglePlaceEntity>) {
    super()
    Object.assign(this, partial)
  }

  @Expose()
  administrativeAreaLevel1: string

  @Expose()
  administrativeAreaLevel2: string

  @Expose()
  country: string

  @Expose()
  formattedAddress: string

  @Expose()
  locality: string

  @Expose()
  placeId: string

  @Expose()
  postalCode: string

  @Expose()
  route: string

  @Expose()
  streetNumber: string
}

export class PlaceEntity extends GooglePlaceEntity {
  constructor(partial: Partial<PlaceEntity>) {
    super(partial)
    Object.assign(this, partial)
  }

  @Expose()
  name: string

  @Expose()
  desc: string

  @Expose()
  @Type(() => GeoPointEntity)
  @Transform(({ value }) => value.coordinates)
  location: GeoPointEntity

  @Expose()
  image: string

  @Expose()
  openHours: string

  @Expose()
  placeId: string

  @Expose()
  email: string

  @Expose()
  priceRange: PRICE_RANGE

  @Expose()
  createdBy: string

  @Expose()
  followersCount: number

  @Expose()
  followers: string[]

  @Expose()
  categories?: string[]

  @Expose()
  phone?: string

  @Expose()
  website?: string

  @Expose()
  facebook?: string

  @Expose()
  instagram?: string
}
