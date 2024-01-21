import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import Mongoose, { Document, SchemaTypes, Types } from 'mongoose'
import { BaseDBObject } from '../utils/BaseDBObject'
import {
  EVENT_TYPES,
  EVENT_SUB_TYPES,
  IArtist,
  IEvent,
  IGeoPoint,
  ISlug,
  PartialPlace
} from 'src/utils/types'
import {
  ArtistSchema,
  GeoPointSchema,
  PartialPlaceSchema,
  SlugSchema
} from 'src/utils/commons.schema'

export type EventDocument = IEvent & Document

export const EVENT_TYPES_TRAD = {
  LIVE_MUSIC: 'Concert'
} as const

export const CONCERT_TYPES_TRAD = {
  'LIVE_MUSIC:INDIE': 'Indie',
  'LIVE_MUSIC:RAP': 'Rap',
  'LIVE_MUSIC:ALTERNATIVE': 'Alternative',
  'LIVE_MUSIC:POP': 'Pop',
  'LIVE_MUSIC:ROCK': 'Rock',
  'LIVE_MUSIC:HIPHOP': 'Hiphop',
  'LIVE_MUSIC:ELECTRONIC': 'Electronic',
  'LIVE_MUSIC:ELECTRO': 'Electro',
  'LIVE_MUSIC:INDIEROCK': 'Indierock',
  'LIVE_MUSIC:POSTPUNK': 'Postpunk',
  'LIVE_MUSIC:RNB': 'Rnb',
  'LIVE_MUSIC:INDIEPOP': 'Indiepop',
  'LIVE_MUSIC:PUNK': 'Punk',
  'LIVE_MUSIC:SOUL': 'Soul',
  'LIVE_MUSIC:DANCE': 'Dance',
  'LIVE_MUSIC:CHANSONFRANCAISE': 'Chanson française',
  'LIVE_MUSIC:HOUSE': 'House',
  'LIVE_MUSIC:SINGERSONGWRITER': 'Singer songwriter',
  'LIVE_MUSIC:FOLK': 'Folk',
  'LIVE_MUSIC:TECHNO': 'Techno',
  'LIVE_MUSIC:FRENCHPOP': 'French pop',
  'LIVE_MUSIC:FUNK': 'Funk',
  'LIVE_MUSIC:JAZZ': 'Jazz',
  'LIVE_MUSIC:DARKWAVE': 'Darkwave',
  'LIVE_MUSIC:EXPERIMENTAL': 'Experimental',
  'LIVE_MUSIC:HYPERPOP': 'Hyperpop',
  'LIVE_MUSIC:METAL': 'Metal',
  'LIVE_MUSIC:NEOSOUL': 'Neosoul',
  'LIVE_MUSIC:POPROCK': 'Poprock'
} as const

@Schema({ timestamps: true, versionKey: false })
export class Event extends BaseDBObject {
  constructor(partial: Partial<EventDocument>) {
    super()
    Object.assign(this, partial)
  }

  @Prop({
    type: String,
    required: true
  })
  name: string

  @Prop({
    type: String
  })
  desc: string

  @Prop({
    type: GeoPointSchema
  })
  location: IGeoPoint

  @Prop({
    type: String
  })
  cover: string

  @Prop({
    type: String
  })
  url: string

  @Prop({
    type: [String],
    default: []
  })
  photos: string[]

  @Prop({
    type: Date
  })
  beginAt: Date

  @Prop({
    type: Date
  })
  endAt: Date

  @Prop({
    type: [ArtistSchema]
  })
  lineup: [IArtist]

  @Prop({
    type: Number,
    default: 0
  })
  minPrice: number

  @Prop({
    type: Boolean
  })
  isSoldOut: boolean

  @Prop({
    type: Number
  })
  maxPrice: number

  @Prop({
    type: Number
  })
  followersCount: number

  @Prop({ type: SlugSchema })
  slugs: ISlug

  @Prop({ type: PartialPlaceSchema })
  place: PartialPlace

  @Prop({ type: [String] })
  categories: (typeof EVENT_TYPES)[]

  @Prop({ type: [String] })
  subCategories: (typeof EVENT_SUB_TYPES)[]

  @Prop({
    type: Boolean,
    required: true,
    default: true
  })
  active: boolean

  @Prop({
    type: Boolean,
    required: true,
    default: false
  })
  private: boolean

  @Prop({
    type: SchemaTypes.ObjectId,
    required: true,
    refPath: 'createdByModel'
  })
  createdBy: Types.ObjectId

  @Prop({
    type: String,
    required: true,
    enum: ['User', 'Place']
  })
  createdByModel: string
}

export const EventSchema = SchemaFactory.createForClass(Event)

EventSchema.index({ location: '2dsphere' })
