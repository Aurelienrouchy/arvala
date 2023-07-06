import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { GeoPoint } from 'src/utils/GeoPoint'
import { BaseDBObject } from '../utils/BaseDBObject'
import {
  ContactsSchema,
  PartialEventSchema,
  PartialPlaceSchema,
  SlugSchema,
  SocialSchema
} from 'src/utils/commons.schema'
import { IPlace, ISlug, IContacts, ISocial, IEvent } from 'src/utils/types'

export type UserDocument = User & Document
export enum ROLE {
  ADMIN = 'admin',
  USER = 'user'
}

export enum PROVIDER_NAME {
  GOOGLE = 'google',
  APPLE = 'apple',
  EMAIL = 'email'
}

@Schema({ timestamps: true, versionKey: false })
export class User extends BaseDBObject {
  constructor(partial: Partial<User>) {
    super()
    Object.assign(this, partial)
  }

  @Prop({ type: String, required: true })
  name: string

  @Prop({ type: String })
  desc: string

  @Prop({ type: GeoPoint, required: true })
  location: GeoPoint

  @Prop({ type: String })
  cover: string

  @Prop({ type: String })
  address: string

  @Prop({ type: String, enum: ROLE, required: true, default: ROLE.USER })
  role: ROLE

  @Prop({ type: [PartialPlaceSchema] })
  places: Pick<IPlace, 'id' | 'name' | 'address'>[]

  @Prop({ type: Number })
  followersCount: number

  @Prop({ type: SlugSchema })
  slugs: ISlug

  @Prop({ type: ContactsSchema })
  contacts: IContacts

  @Prop({ type: SocialSchema })
  social: ISocial

  @Prop({ type: [PartialEventSchema] })
  events: Pick<
    IEvent,
    'id' | 'name' | 'place' | 'cover' | 'beginAt' | 'minPrice'
  >[]
}

export const UsersSchema = SchemaFactory.createForClass(User)
