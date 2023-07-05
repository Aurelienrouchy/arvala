import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, SchemaTypes, Types } from 'mongoose'
import { BaseDBObject } from '../utils/BaseDBObject'
import { GeoPoint } from '../utils/GeoPoint'

export type PlaceDocument = Place & Document

export enum PRICE_RANGE {
  $ = '$',
  $$ = '$$',
  $$$ = '$$$',
  $$$$ = '$$$$',
  FREE = 'FREE'
}

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
    type: String,
    maxlength: 5000,
    min: 1,
    required: true
  })
  desc: string

  @Prop({
    type: GeoPoint,
    required: true
  })
  location: GeoPoint

  @Prop({
    type: String,
    required: true
  })
  image: string

  @Prop({
    type: [[Number]],
    required: true,
    default: []
  })
  openHours: number[][]

  @Prop({
    type: String,
    required: true
  })
  placeId: string

  @Prop({
    type: String
  })
  administrativeAreaLevel1: string

  @Prop({
    type: String
  })
  administrativeAreaLevel2: string

  @Prop({
    type: String
  })
  country: string

  @Prop({
    type: String
  })
  formattedAddress: string

  @Prop({
    type: String
  })
  locality: string

  @Prop({
    type: String
  })
  postalCode: string

  @Prop({
    type: String
  })
  route: string

  @Prop({
    type: String
  })
  streetNumber: string

  @Prop({
    type: String
  })
  phone: string

  @Prop({
    type: String
  })
  website: string

  @Prop({
    type: String
  })
  facebook: string

  @Prop({
    type: String
  })
  instagram: string

  @Prop({
    type: String
  })
  email: string

  @Prop({
    type: String,
    required: true
  })
  priceRange: PRICE_RANGE

  @Prop({ type: [SchemaTypes.ObjectId], ref: 'User', default: [] })
  followers: Types.ObjectId[]

  @Prop({
    type: Number,
    required: true,
    default: 0
  })
  followersCount: number

  @Prop({
    type: [String],
    default: []
  })
  categories: string[]

  @Prop({ type: [SchemaTypes.ObjectId], ref: 'User', require: true })
  createdBy: Types.ObjectId[]
}

export const PlacesSchema = SchemaFactory.createForClass(Place)
