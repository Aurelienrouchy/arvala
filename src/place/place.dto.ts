import { Expose, Transform, Type } from 'class-transformer'
import { IsDefined, IsOptional } from 'class-validator'
import { AbstractEntity } from 'src/utils/BaseDBObject'
import { GeoPointEntity } from 'src/utils/GeoPoint'
import {
  PRICE_RANGE,
  PLACE_TYPES,
  IContacts,
  IDrink,
  IDrinkBestPrices,
  IHours,
  ISlug,
  ISocial,
  PLACE_SUB_TYPES,
  IGeoPoint,
  DrinkClass,
  ContactsClass,
  SlugClass,
  SocialClass,
  VERIFICATION_STATUS,
  PartialPlace,
  IHoursFormatted,
  HoursFormattedClass,
  IEvent
} from 'src/utils/types'
import { Types } from 'mongoose'
import { EventEntityMinimize, PartialPlaceEntity } from 'src/event/event.dto'

export class CreatePlaceDto extends AbstractEntity {
  @IsDefined()
  name: string

  @IsOptional()
  desc: string

  @IsDefined()
  location: IGeoPoint

  @IsOptional()
  cover: string

  @IsOptional()
  photos: string[]

  @IsOptional()
  hours: IHours

  @IsOptional()
  hoursFormatted: IHoursFormatted

  @IsOptional()
  happyHours: IHours

  @IsDefined()
  address: string

  @IsOptional()
  slugs: ISlug

  @IsOptional()
  bestPriceBeer: number

  @IsOptional()
  hasFreeWifi: boolean

  @IsOptional()
  hasAirConditioning: boolean

  @IsOptional()
  hasTelevision: boolean

  @IsOptional()
  hasDarts: boolean

  @IsOptional()
  hasFoosball: boolean

  @IsOptional()
  hasPinball: boolean

  @IsOptional()
  hasPool: boolean

  @IsOptional()
  hasTerrace: boolean

  @IsOptional()
  hasHandicapAccess: boolean

  @IsOptional()
  hasFood: boolean

  @IsOptional()
  hasDogPolicy: boolean

  @IsOptional()
  hasBoardGames: boolean

  @IsOptional()
  hasLiveMusic: boolean

  @IsOptional()
  hasDjSet: boolean

  @IsOptional()
  hasTakeAway: boolean

  @IsOptional()
  contacts: IContacts

  @IsOptional()
  social: ISocial

  @IsOptional()
  verificationStatus: typeof VERIFICATION_STATUS

  @IsOptional()
  price: typeof PRICE_RANGE

  @IsDefined()
  categories: (typeof PLACE_TYPES)[]

  @IsOptional()
  subCategories: (typeof PLACE_SUB_TYPES)[]

  @IsOptional()
  menu: string

  @IsOptional()
  drinks: [IDrink]

  @IsOptional()
  bestPrice: IDrinkBestPrices

  @IsDefined()
  createdBy: Types.ObjectId
}

export class PlaceEntity extends AbstractEntity {
  constructor(partial: Partial<PlaceEntity>) {
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
  @Transform(({ value }) => value.coordinates)
  location: GeoPointEntity

  @Expose()
  cover: string

  @Expose()
  photos: string[]

  @Expose({ name: 'hoursFormatted' })
  @Type(() => HoursFormattedClass)
  hours: IHoursFormatted

  @Expose()
  address: string

  @Expose()
  @Type(() => SlugClass)
  slugs: ISlug

  @Expose()
  @Type(() => ContactsClass)
  contacts: IContacts

  @Expose()
  @Type(() => SocialClass)
  social: ISocial

  @Expose()
  verificationStatus: typeof VERIFICATION_STATUS

  @Expose()
  price: typeof PRICE_RANGE

  @Expose()
  categories: (typeof PLACE_TYPES)[]

  @Expose()
  subCategories: (typeof PLACE_SUB_TYPES)[]

  @Expose()
  menu: string

  @Expose()
  @Type(() => DrinkClass)
  drinks: [IDrink]

  @Expose()
  bestPrice: IDrinkBestPrices

  @Expose()
  @Type(() => EventEntityMinimize)
  events: Pick<
    IEvent,
    'id' | 'name' | 'place' | 'cover' | 'beginAt' | 'minPrice'
  >[]

  @Expose()
  createdBy: Types.ObjectId
}

export class PlaceEntityMinimize extends AbstractEntity {
  constructor(partial: Partial<PlaceEntity>) {
    super()
    Object.assign(this, partial)
  }

  @Expose()
  @Transform(({ obj }) => obj._id)
  id: string

  @Expose()
  name: string

  @Expose()
  cover: string

  @Expose()
  distance: number

  @Expose()
  followersCount: number

  @Expose()
  @Type(() => GeoPointEntity)
  @Transform(({ value }) => value.coordinates)
  location: GeoPointEntity

  @Expose()
  address: string
}
