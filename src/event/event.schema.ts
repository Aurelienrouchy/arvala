import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, SchemaTypes, Types } from 'mongoose'
import { BaseDBObject } from '../utils/BaseDBObject'
import { GeoPoint } from '../utils/GeoPoint'

export type EventDocument = Event & Document

@Schema({ timestamps: true, versionKey: false })
export class Event extends BaseDBObject {
  constructor(partial: Partial<Event>) {
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
    type: [String],
    default: []
  })
  photos: string[]

  @Prop({
    type: Date,
    required: true
  })
  beginAt: Date

  @Prop({
    type: Date,
    required: true
  })
  endAt: Date

  @Prop({
    type: Number,
    required: true,
    max: 1_000,
    min: 0,
    default: 0
  })
  price: number

  @Prop({ type: [SchemaTypes.ObjectId], ref: 'User', default: [] })
  followers: Types.ObjectId[]

  @Prop({
    type: Number,
    required: true,
    default: 0
  })
  followersCount: number

  @Prop({
    type: String,
    required: true
  })
  placeId: string

  @Prop({
    type: [String],
    required: true
  })
  categories: string[]

  @Prop({
    type: Boolean,
    required: true,
    default: true
  })
  active: boolean

  @Prop({
    type: Boolean,
    required: true,
    default: true
  })
  private: boolean

  @Prop({ type: [SchemaTypes.ObjectId], ref: 'User', require: true })
  createdBy: Types.ObjectId[]
}

export const EventsSchema = SchemaFactory.createForClass(Event)

EventsSchema.index({ location: '2dsphere' })
