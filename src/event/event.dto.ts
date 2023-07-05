import { Expose, Transform, Type } from 'class-transformer'
import {
  IsBoolean,
  IsDateString,
  IsDefined,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength
} from 'class-validator'
import { AbstractEntity } from 'src/utils/BaseDBObject'
import { GeoPoint, GeoPointEntity } from 'src/utils/GeoPoint'

export class UpdateEventDto {
  id: string
  name: string
  birthDate: Date
  gender: number
  interestedIn: number
}

export class CreateEventDto {
  @IsDefined()
  @IsString()
  @MinLength(1, {
    message: 'La longueur du titre doit être superieur ou égale à 1 caractère.'
  })
  @MaxLength(255, {
    message:
      'La longueur du titre doit être inférieure ou égale à 255 caractères.'
  })
  name: string

  @IsDefined()
  @IsString()
  @MinLength(1, {
    message:
      'La longueur de la description doit être superieur ou égale à 1 caractères.'
  })
  @MaxLength(5000, {
    message:
      'La longueur de la description doit être inférieure ou égale à 5000 caractères.'
  })
  @IsDefined()
  desc: string

  @IsOptional()
  photo?: string[]

  @IsDefined()
  location: GeoPoint

  @IsDefined()
  @IsString()
  image: string

  @IsDefined()
  @IsDateString()
  beginAt: Date

  @IsDefined()
  @IsDateString()
  endAt: Date

  @IsDefined()
  @IsNumber()
  price: number

  @IsDefined()
  @IsString()
  placeId: string

  @IsDefined()
  categories: string[]

  @IsDefined()
  @IsBoolean()
  active: boolean

  @IsDefined()
  @IsBoolean()
  private: boolean
}

export class EventEntity extends AbstractEntity {
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
  @Type(() => GeoPointEntity)
  @Transform(({ value }) => value)
  location: GeoPointEntity

  @Expose()
  image: string

  @Expose()
  photos: string[]

  @Expose()
  beginAt: Date

  @Expose()
  endAt: Date

  @Expose()
  price: number

  @Expose()
  distance: number

  @Expose()
  followers: string[]

  @Expose()
  followersCount: number

  @Expose()
  placeId: string

  @Expose()
  categories: string[]

  @Expose()
  active: boolean

  @Expose()
  private: boolean

  @Expose()
  createdBy: string
}
