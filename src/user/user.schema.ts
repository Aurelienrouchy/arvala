import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, SchemaTypes, Types } from 'mongoose'
import { GeoPoint } from 'src/utils/GeoPoint'
import { BaseDBObject } from '../utils/BaseDBObject'

export type UserDocument = User & Document
export enum ROLE {
  ADMIN = 'admin',
  USER = 'user'
}
export enum PLAN_TYPE {
  FREE = 'free',
  PREMIUM = 'premium',
  PREMIUM_PLUS = 'premium_plus'
}
export enum PLAN_BILLING_TYPE {
  MONTHLY = 'monthly',
  ANNUAL = 'annual'
}
export enum VERIFICATION_STATUS {
  VERIFIED = 'verified',
  IN_PROGRESS = 'in_progress',
  NOT_VERIFIED = 'not_verified'
}
export enum PROVIDER_NAME {
  GOOGLE = 'google',
  APPLE = 'apple',
  EMAIL = 'email'
}

export type PhoneType = {
  countryCode: string
  number: string
}

@Schema({ versionKey: false })
export class Phone {
  constructor(phone: PhoneType) {
    Object.assign(this, phone)
  }

  @Prop({ type: String })
  countryCode: string

  @Prop({ type: String })
  number: string
}

@Schema({ timestamps: true, versionKey: false })
export class User extends BaseDBObject {
  constructor(partial: Partial<User>) {
    super()
    Object.assign(this, partial)
  }

  @Prop({ type: String, enum: ROLE, required: true, default: ROLE.USER })
  role: ROLE

  @Prop({ type: String, required: true })
  name: string

  @Prop({ type: [SchemaTypes.ObjectId], ref: 'Place', default: [] })
  places: Types.ObjectId[]

  @Prop({ type: [SchemaTypes.ObjectId], ref: 'User', default: [] })
  followers: Types.ObjectId[]

  @Prop({ type: String })
  desc: string

  @Prop({
    type: GeoPoint,
    required: true
  })
  location: GeoPoint

  @Prop({ type: String })
  email: string

  @Prop({ type: Phone })
  phone: PhoneType

  @Prop({ type: String })
  website: string

  @Prop({ type: String })
  instagram: string

  @Prop({ type: String })
  facebook: string

  @Prop({ type: [SchemaTypes.ObjectId], ref: 'Event', default: [] })
  events: Types.ObjectId[]

  @Prop({ type: [SchemaTypes.ObjectId], ref: 'Event', default: [] })
  eventsLiked: Types.ObjectId[]

  @Prop({ type: String })
  providerId: string

  @Prop({ type: String, enum: PROVIDER_NAME, required: true })
  providerName: PROVIDER_NAME

  @Prop({ type: String })
  picture: string
}

export const UsersSchema = SchemaFactory.createForClass(User)
