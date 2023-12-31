import { Schema } from 'mongoose'
import {
  BarType,
  IArtist,
  IContacts,
  IDrink,
  IDrinkBestPrices,
  IGeoPoint,
  IHours,
  IHoursFormatted,
  ISlug,
  ISocial,
  IStartEnd,
  PartialEvent,
  PartialPlace
} from './types'
import { AbstractEntity } from './BaseDBObject'
import { Expose } from 'class-transformer'

export const ArtistSchema = new Schema<IArtist>(
  {
    about: { type: String, default: null },
    image: { type: String, default: null },
    name: { type: String, default: null }
  },
  { _id: false }
)

export const SlugSchema = new Schema<ISlug>(
  {
    shotgun: { type: String, default: null },
    dice: { type: String, default: null },
    facebook: { type: String, default: null },
    billetreduc: { type: String, default: null },
    schlouk: { type: String, default: null },
    google: { type: String, default: null }
  },
  { _id: false }
)

export const StartEndSchema = new Schema<IStartEnd>(
  {
    start: { type: Number, default: null },
    end: { type: Number, default: null }
  },
  { _id: false }
)

export const HourSchema = new Schema<IHours>(
  {
    mon: [{ type: StartEndSchema, default: null }],
    tue: [{ type: StartEndSchema, default: null }],
    wed: [{ type: StartEndSchema, default: null }],
    thu: [{ type: StartEndSchema, default: null }],
    fri: [{ type: StartEndSchema, default: null }],
    sat: [{ type: StartEndSchema, default: null }],
    sun: [{ type: StartEndSchema, default: null }]
  },
  { _id: false }
)

export const HourFormattedSchema = new Schema<IHoursFormatted>(
  {
    mon: { type: String, default: null },
    tue: { type: String, default: null },
    wed: { type: String, default: null },
    thu: { type: String, default: null },
    fri: { type: String, default: null },
    sat: { type: String, default: null },
    sun: { type: String, default: null }
  },
  { _id: false }
)

export const GeoPointSchema = new Schema<IGeoPoint>(
  {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
      required: true
    },
    coordinates: {
      type: [Number],
      default: [0, 0],
      required: true
    }
  },
  { _id: false }
)

export const ContactsSchema = new Schema<IContacts>(
  {
    phone: { type: String, default: null },
    email: { type: String, default: null }
  },
  { _id: false }
)

export const DrinksSchema = new Schema<IDrink>(
  {
    name: { type: String, default: null },
    type: { type: String, default: null },
    details: { type: String, default: null },
    standardPrice: { type: String, default: null },
    happyPrice: { type: String, default: null }
  },
  { _id: false }
)

export const DrinkBestPricesSchema = new Schema<IDrinkBestPrices>(
  {
    beer: { type: Number, default: null },
    cocktail: { type: Number, default: null },
    wine: { type: Number, default: null },
    soft: { type: Number, default: null }
  },
  { _id: false }
)

export const BarTypeSchema = new Schema<BarType>(
  {
    name: { type: String, default: null },
    slug: { type: String, default: null },
    icon: { type: String, default: null }
  },
  { _id: false }
)

export const SocialSchema = new Schema<ISocial>(
  {
    dice: { type: String, default: null },
    website: { type: String, default: null },
    instagram: { type: String, default: null },
    soundcloud: { type: String, default: null },
    spotify: { type: String, default: null },
    facebook: { type: String, default: null },
    twitter: { type: String, default: null },
    tiktok: { type: String, default: null },
    whatsApp: { type: String, default: null },
    messenger: { type: String, default: null },
    discord: { type: String, default: null }
  },
  { _id: false }
)

export const PartialPlaceSchema = new Schema<PartialPlace>(
  {
    id: { type: String, ref: 'Place', require: true },
    name: { type: String, require: true },
    address: { type: String, require: true }
  },
  { _id: false }
)

export const PartialEventSchema = new Schema<PartialEvent>(
  {
    id: { type: String, ref: 'Event', required: true },
    name: { type: String, required: true },
    place: { type: PartialPlaceSchema, required: true },
    cover: { type: String },
    beginAt: { type: Date, required: true },
    minPrice: { type: Number }
  },
  { _id: false }
)
