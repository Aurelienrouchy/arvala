import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, SchemaTypes, Types } from 'mongoose'
import { BaseDBObject } from '../utils/BaseDBObject'
import {
  BarTypeSchema,
  ContactsSchema,
  DrinkBestPricesSchema,
  DrinksSchema,
  GeoPointSchema,
  HourFormattedSchema,
  HourSchema,
  SlugSchema,
  SocialSchema
} from 'src/utils/commons.schema'
import {
  IContacts,
  IDrink,
  IDrinkBestPrices,
  IGeoPoint,
  IHours,
  ISlug,
  ISocial,
  PLACE_SUB_TYPES,
  PRICE_RANGE,
  PLACE_TYPES,
  VERIFICATION_STATUS,
  BarType,
  IHoursFormatted
} from 'src/utils/types'

export type PlaceDocument = Place & Document

@Schema({ timestamps: true, versionKey: false })
export class Place extends BaseDBObject {
  constructor(partial: Partial<Place>) {
    super()
    Object.assign(this, partial)
  }

  @Prop({
    type: String,
    maxlength: 255,
    min: 1,
    required: true
  })
  name: string

  @Prop({
    type: String
  })
  desc: string

  @Prop({
    type: GeoPointSchema,
    required: true
  })
  location: IGeoPoint

  @Prop({
    type: String
  })
  cover: string

  @Prop({
    type: [String]
  })
  photos: string[]

  @Prop({
    type: HourSchema
  })
  hours: IHours

  @Prop({
    type: HourFormattedSchema
  })
  hoursFormatted: IHours

  @Prop({
    type: HourSchema
  })
  happyHours: IHoursFormatted

  @Prop({
    type: String
  })
  address: string

  @Prop({
    type: SlugSchema
  })
  slugs: ISlug

  @Prop({
    type: ContactsSchema
  })
  contacts: IContacts

  @Prop({
    type: SocialSchema
  })
  social: ISocial

  @Prop({
    type: Number,
    required: true,
    default: VERIFICATION_STATUS.NOT_VERIFIED
  })
  verificationStatus: typeof VERIFICATION_STATUS

  @Prop({
    type: Number
  })
  price: typeof PRICE_RANGE

  @Prop({
    type: Number
  })
  followersCount: number

  @Prop({
    type: [String]
  })
  categories: string[]

  @Prop({
    type: [String]
  })
  subCategories: string[]

  @Prop({
    type: String
  })
  menu: string

  @Prop({
    type: [DrinksSchema]
  })
  drinks: [IDrink]

  @Prop({
    type: [DrinkBestPricesSchema]
  })
  bestPrice: IDrinkBestPrices

  @Prop({ type: [SchemaTypes.ObjectId], ref: 'Event' })
  events: Types.ObjectId[]

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User' })
  createdBy: Types.ObjectId
}

export const PlacesSchema = SchemaFactory.createForClass(Place)

PlacesSchema.index({ location: '2dsphere' })
