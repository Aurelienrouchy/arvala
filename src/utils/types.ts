import { Expose, Type } from 'class-transformer'

export const EVENT_TYPES = {
  LIVE_MUSIC: 'LIVE_MUSIC',
  DJ: 'DJ'
} as const

export const PRICE_RANGE = {
  FREE: 0,
  $: 1,
  $$: 2,
  $$$: 3,
  $$$$: 4
} as const

export const VERIFICATION_STATUS = {
  VERIFIED: 2,
  IN_PROGRESS: 1,
  NOT_VERIFIED: 0
} as const

export const ROLE = {
  ADMIN: 'ADMIN',
  USER: 'USER'
} as const

export const PROVIDER_NAME = {
  GOOGLE: 'GOOGLE',
  APPLE: 'APPLE',
  EMAIL: 'EMAIL'
} as const

export const EVENT_SUB_TYPES = {
  LIVE_MUSIC_INDIE: 'LIVE_MUSIC:INDIE',
  LIVE_MUSIC_RAP: 'LIVE_MUSIC:RAP',
  LIVE_MUSIC_ALTERNATIVE: 'LIVE_MUSIC:ALTERNATIVE',
  LIVE_MUSIC_POP: 'LIVE_MUSIC:POP',
  LIVE_MUSIC_ROCK: 'LIVE_MUSIC:ROCK',
  LIVE_MUSIC_HIPHOP: 'LIVE_MUSIC:HIPHOP',
  LIVE_MUSIC_ELECTRONIC: 'LIVE_MUSIC:ELECTRONIC',
  LIVE_MUSIC_ELECTRO: 'LIVE_MUSIC:ELECTRO',
  LIVE_MUSIC_INDIEROCK: 'LIVE_MUSIC:INDIEROCK',
  LIVE_MUSIC_POSTPUNK: 'LIVE_MUSIC:POSTPUNK',
  LIVE_MUSIC_RNB: 'LIVE_MUSIC:RNB',
  LIVE_MUSIC_INDIEPOP: 'LIVE_MUSIC:INDIEPOP',
  LIVE_MUSIC_PUNK: 'LIVE_MUSIC:PUNK',
  LIVE_MUSIC_SOUL: 'LIVE_MUSIC:SOUL',
  LIVE_MUSIC_DANCE: 'LIVE_MUSIC:DANCE',
  LIVE_MUSIC_CHANSONFRANCAISE: 'LIVE_MUSIC:CHANSONFRANCAISE',
  LIVE_MUSIC_HOUSE: 'LIVE_MUSIC:HOUSE',
  LIVE_MUSIC_SINGERSONGWRITER: 'LIVE_MUSIC:SINGERSONGWRITER',
  LIVE_MUSIC_FOLK: 'LIVE_MUSIC:FOLK',
  LIVE_MUSIC_TECHNO: 'LIVE_MUSIC:TECHNO',
  LIVE_MUSIC_FRENCHPOP: 'LIVE_MUSIC:FRENCHPOP',
  LIVE_MUSIC_FUNK: 'LIVE_MUSIC:FUNK',
  LIVE_MUSIC_JAZZ: 'LIVE_MUSIC:JAZZ',
  LIVE_MUSIC_DARKWAVE: 'LIVE_MUSIC:DARKWAVE',
  LIVE_MUSIC_EXPERIMENTAL: 'LIVE_MUSIC:EXPERIMENTAL',
  LIVE_MUSIC_HYPERPOP: 'LIVE_MUSIC:HYPERPOP',
  LIVE_MUSIC_METAL: 'LIVE_MUSIC:METAL',
  LIVE_MUSIC_NEOSOUL: 'LIVE_MUSIC:NEOSOUL',
  LIVE_MUSIC_POPROCK: 'LIVE_MUSIC:POPROCK',
  LIVE_MUSIC_SALSA: 'LIVE_MUSIC:SALSA',
  LIVE_MUSIC_BACHATA: 'LIVE_MUSIC:BACHATA',
  LIVE_MUSIC_MERENGUE: 'LIVE_MUSIC:MERENGUE',
  LIVE_MUSIC_REGGAETON: 'LIVE_MUSIC:REGGAETON',
  LIVE_MUSIC_BAILEFUNK: 'LIVE_MUSIC:BAILEFUNK',
  LIVE_MUSIC_COUNTRY: 'LIVE_MUSIC:COUNTRY',
  LIVE_MUSIC_REGGAE: 'LIVE_MUSIC:REGGAE',
  LIVE_MUSIC_BLUES: 'LIVE_MUSIC:BLUES',
  LIVE_MUSIC_KPOP: 'LIVE_MUSIC:KPOP',
  DJ_HOUSE: 'DJ:HOUSE',
  DJ_ELECTRO: 'DJ:ELECTRO',
  DJ_HIPHOP: 'DJ:HIPHOP',
  DJ_TECHNO: 'DJ:TECHNO',
  DJ_DISCO: 'DJ:DISCO',
  DJ_AFROBEAT: 'DJ:AFROBEAT',
  DJ_RAP: 'DJ:RAP',
  DJ_RNB: 'DJ:RNB',
  DJ_TRAP: 'DJ:TRAP',
  DJ_AFROHOUSE: 'DJ:AFROHOUSE',
  DJ_AMAPIANO: 'DJ:AMAPIANO',
  DJ_ELECTRONIC: 'DJ:ELECTRONIC',
  DJ_POP: 'DJ:POP',
  DJ_TECHHOUSE: 'DJ:TECHHOUSE',
  DJ_TRANCE: 'DJ:TRANCE',
  DJ_AFROPOP: 'DJ:AFROPOP',
  DJ_DEEPHOUSE: 'DJ:DEEPHOUSE',
  DJ_PROGRESSIVEHOUSE: 'DJ:PROGRESSIVEHOUSE',
  DJ_SOUL: 'DJ:SOUL',
  DJ_AFROBEATS: 'DJ:AFROBEATS',
  DJ_AFROTECH: 'DJ:AFROTECH',
  DJ_AFROTRONICA: 'DJ:AFROTRONICA',
  DJ_AMBIENT: 'DJ:AMBIENT',
  DJ_BASS: 'DJ:BASS',
  DJ_ELECTRODISCO: 'DJ:ELECTRODISCO',
  DJ_FUNK: 'DJ:FUNK',
  DJ_JUNGLE: 'DJ:JUNGLE',
  DJ_MELODICTECHNO: 'DJ:MELODICTECHNO',
  DJ_ACIDTECHNO: 'DJ:ACIDTECHNO',
  DJ_HARDCORE: 'DJ:HARDCORE',
  DJ_HARDTECHNO: 'DJ:HARDTECHNO',
  DJ_HARDGROOVE: 'DJ:HARDGROOVE',
  DJ_GERMANTECHNO: 'DJ:GERMANTECHNO',
  DJ_INDUS: 'DJ:INDUS',
  DJ_DISCOHOUSE: 'DJ:DISCOHOUSE',
  DJ_ELECTROHOUSE: 'DJ:ELECTROHOUSE',
  DJ_EURODANCE: 'DJ:EURODANCE',
  DJ_SYNTHPOP: 'DJ:SYNTHPOP',
  DJ_ACIDHOUSE: 'DJ:ACIDHOUSE',
  DJ_PROGRESSIVETRANCE: 'DJ:PROGRESSIVETRANCE',
  DJ_PSYTRANCE: 'DJ:PSYTRANCE',
  DJ_DANCEHALL: 'DJ:DANCEHALL',
  DJ_BALEARIC: 'DJ:BALEARIC',
  DJ_DETROITTECHNO: 'DJ:DETROITTECHNO',
  DJ_DEEPTECHNO: 'DJ:DEEPTECHNO',
  DJ_DOWNTEMPO: 'DJ:DOWNTEMPO',
  DJ_DUB: 'DJ:DUB',
  DJ_DUBTECHNO: 'DJ:DUBTECHNO',
  DJ_DRUMBASS: 'DJ:DRUMBASS',
  DJ_MINIMALSYNTH: 'DJ:MINIMALSYNTH',
  DJ_MPB: 'DJ:MPB',
  DJ_ELECTRONICA: 'DJ:ELECTRONICA',
  DJ_GHETTOTECH: 'DJ:GHETTOTECH',
  DJ_INDUSTRIAL: 'DJ:INDUSTRIAL',
  DJ_GABBER: 'DJ:GABBER',
  DJ_FRENCHCORE: 'DJ:FRENCHCORE',
  DJ_HARDTRANCE: 'DJ:HARDTRANCE',
  DJ_HARDTEK: 'DJ:HARDTEK',
  DJ_SAMBA: 'DJ:SAMBA',
  DJ_BRAZILIAN: 'DJ:BRAZILIAN',
  DJ_DARKPSYTRANCE: 'DJ:DARKPSYTRANCE',
  DJ_PROGRESSIVEPSYTRANCE: 'DJ:PROGRESSIVEPSYTRANCE',
  DJ_JERSEYCLUB: 'DJ:JERSEYCLUB',
  DJ_GRIME: 'DJ:GRIME',
  DJ_DANCE: 'DJ:DANCE',
  DJ_ACIDCORE: 'DJ:ACIDCORE',
  DJ_MICROHOUSE: 'DJ:MICROHOUSE',
  DJ_MINIMALHOUSE: 'DJ:MINIMALHOUSE',
  DJ_INDIEDANCE: 'DJ:INDIEDANCE',
  DJ_MINIMALTECHNO: 'DJ:MINIMALTECHNO',
  DJ_INDUSTRIALTECHNO: 'DJ:INDUSTRIALTECHNO',
  DJ_ITALODISCO: 'DJ:ITALODISCO',
  DJ_TRIBALHOUSE: 'DJ:TRIBALHOUSE',
  DJ_NEWWAVE: 'DJ:NEWWAVE',
  DJ_CLUB: 'DJ:CLUB',
  DJ_DRILL: 'DJ:DRILL',
  DJ_UKGARAGE: 'DJ:UKGARAGE',
  DJ_NEWRAVE: 'DJ:NEWRAVE',
  DJ_WORLDMUSIC: 'DJ:WORLDMUSIC',
  DJ_BREAKBEAT: 'DJ:BREAKBEAT',
  DJ_PSYCHEDELICROCK: 'DJ:PSYCHEDELICROCK',
  DJ_NEORAVE: 'DJ:NEORAVE',
  DJ_DUBSTEP: 'DJ:DUBSTEP',
  DJ_EBM: 'DJ:EBM',
  DJ_CHICAGOHOUSE: 'DJ:CHICAGOHOUSE',
  DJ_BREAKCORE: 'DJ:BREAKCORE',
  DJ_ALTERNATIVEDANCE: 'DJ:ALTERNATIVEDANCE',
  DJ_HARDSTYLE: 'DJ:HARDSTYLE',
  DJ_GARAGE: 'DJ:GARAGE',
  DJ_EDM: 'DJ:EDM',
  DJ_AXÉ: 'DJ:AXÉ',
  DJ_SYNTHWAVE: 'DJ:SYNTHWAVE',
  DJ_GOTH: 'DJ:GOTH',
  DJ_INDUSTRIALMETAL: 'DJ:INDUSTRIALMETAL',
  DJ_VAPORWAVE: 'DJ:VAPORWAVE'
} as const

export const PLACE_TYPES = {
  FESTIVAL: 'FESTIVAL',
  SPORTS_EVENT: 'SPORTS_EVENT',
  LIVE_MUSIC_VENUE: 'LIVE_MUSIC_VENUE',
  OPERA_HOUSE: 'OPERA_HOUSE',
  THEATRE: 'THEATRE',
  COMEDY_CLUB: 'COMEDY_CLUB',
  JAZZ_CLUB: 'JAZZ_CLUB',
  KARAOKE: 'KARAOKE',
  NIGHT_CLUB: 'NIGHT_CLUB',
  ESCAPE_GAME_ROOM: 'ESCAPE_GAME_ROOM',
  ART_GALLERY: 'ART_GALLERY',
  MOVIE_THEATRE: 'MOVIE_THEATRE',
  DRIVEIN_MOVIE_THEATER: 'DRIVEIN_MOVIE_THEATER',
  MUSEUM: 'MUSEUM',
  MARKET: 'MARKET',
  PET_CAFE: 'PET_CAFE',
  COFFEE_SHOP: 'COFFEE_SHOP',
  TEA_ROOM: 'TEA_ROOM',
  CAFE: 'CAFE',
  RESTAURANT: 'RESTAURANT',
  IRISH_PUB: 'IRISH_PUB',
  WINE_BAR: 'WINE_BAR',
  TIKI_BAR: 'TIKI_BAR',
  DANSE: 'DANSE',
  HOOKAH_LOUNGE: 'HOOKAH_LOUNGE',
  LOUNGE: 'LOUNGE',
  BEER_BAR: 'BEER_BAR',
  GAY_BAR: 'GAY_BAR',
  SAKE_BAR: 'SAKE_BAR',
  BEER_GARDEN: 'BEER_GARDEN',
  PUB: 'PUB',
  COCKTAIL_BAR: 'COCKTAIL_BAR',
  SPEAKEASY: 'SPEAKEASY',
  HOTEL_BAR: 'HOTEL_BAR',
  WHISKY_BAR: 'WHISKY_BAR',
  NIGHT_BAR: 'NIGHT_BAR',
  DIVE_BAR: 'DIVE_BAR',
  SPORTS_BAR: 'SPORTS_BAR',
  CABARET: 'CABARET',
  BAR: 'BAR'
} as const

export const PLACE_SUB_TYPES = {
  BEER_BAR: 'BEER_BAR',
  BRASSERIE: 'BRASSERIE',
  COCKTAIL_BAR: 'COCKTAIL_BAR',
  TAPAS_BAR: 'TAPAS_BAR',
  ASIA_BAR: 'ASIA_BAR',
  LATINO_BAR: 'LATINO_BAR',
  NIGHT_BAR: 'NIGHT_BAR',
  LIVE_BAR: 'LIVE_BAR',
  PUB: 'PUB',
  SPORTS_BAR: 'SPORTS_BAR',
  LIVE_MUSIC_CAFE: 'LIVE_MUSIC:CAFE',
  NEIGHBORHOOD_BAR: 'NEIGHBORHOOD_BAR',
  STUDENT_BAR: 'STUDENT_BAR',
  ITALIAN_BAR: 'ITALIAN_BAR',
  LOUNGE: 'LOUNGE',
  WINE_BAR: 'WINE_BAR',
  ALT_BAR: 'ALT_BAR',
  SPANISH_BAR: 'SPANISH_BAR',
  CAFE: 'CAFE',
  TEA_ROOM: 'TEA_ROOM',
  ALCOOL_BAR: 'ALCOOL_BAR',
  HOTEL_BAR: 'HOTEL_BAR',
  ROOFTOP_BAR: 'ROOFTOP_BAR',
  WORKING_CAFE: 'WORKING_CAFE',
  HIDDEN_BAR: 'HIDDEN_BAR',
  HIP_HOP_BAR: 'HIP_HOP_BAR',
  ARTISANALE_BAR: 'ARTISANALE_BAR',
  KARAOKE: 'KARAOKE',
  GAME_BAR: 'GAME_BAR',
  IRISH_PUB: 'IRISH_PUB',
  INSOLITE_BAR: 'INSOLITE_BAR',
  GUINGUETTE: 'GUINGUETTE',
  SPEAKEASY: 'SPEAKEASY',
  MUSIC_BAR: 'MUSIC:BAR',
  SCOTT_BAR: 'SCOTT_BAR',
  COFFEE_SHOP: 'COFFEE_SHOP',
  SHOT_BAR: 'SHOT_BAR',
  JAZZ_CLUB: 'JAZZ_CLUB',
  HOOKAH_LOUNGE: 'HOOKAH_LOUNGE',
  COMEDY_CLUB: 'COMEDY_CLUB',
  GAY_BAR: 'GAY_BAR',
  BOAT_BAR: 'BOAT_BAR',
  POOL_BAR: 'POOL_BAR',
  CAVE_BAR: 'CAVE_BAR',
  RHUM_BAR: 'RHUM_BAR',
  INDIE_BAR: 'INDIE_BAR',
  CIDRE_BAR: 'CIDRE_BAR',
  ASSO_BAR: 'ASSO_BAR',
  PMU: 'PMU'
} as const

export enum PLACE_TYPES_TRAD {
  FESTIVAL = 'Festival',
  SPORTS_EVENT = 'Évènement sportif',
  LIVE_MUSIC_VENUE = 'Salle de concert',
  OPERA_HOUSE = 'Opéra',
  THEATRE = 'Théâtre',
  COMEDY_CLUB = 'Comedy club',
  JAZZ_CLUB = 'Club de jazz',
  KARAOKE = 'Karaoké',
  NIGHT_CLUB = 'Club',
  ESCAPE_GAME_ROOM = 'Salle d’escape game',
  ART_GALLERY = 'Galerie d’art',
  MOVIE_THEATRE = 'Cinéma',
  DRIVEIN_MOVIE_THEATER = 'Cinéma de plein air',
  MUSEUM = 'Musée',
  MARKET = 'Marché',
  PET_CAFE = 'Café avec des animaux',
  COFFEE_SHOP = 'Coffee Shop',
  TEA_ROOM = 'Salon de thé',
  CAFE = 'Café',
  RESTAURANT = 'Restaurant',
  IRISH_PUB = 'Pub irlandais',
  WINE_BAR = 'Bar à vin',
  TIKI_BAR = 'Tiki bar',
  DANSE = 'Danse',
  HOOKAH_LOUNGE = 'Bar à narguilé',
  LOUNGE = 'Lounge',
  BEER_BAR = 'Bar à bières',
  GAY_BAR = 'Bar gay',
  BEER_GARDEN = 'Bar en plein air',
  PUB = 'Bar',
  COCKTAIL_BAR = 'Bar à cocktails',
  SPEAKEASY = 'Bar clandestin',
  HOTEL_BAR = 'Bar d’hôtel',
  WHISKY_BAR = 'Bar à whisky',
  NIGHT_BAR = 'Bar de nuit',
  DIVE_BAR = 'Troquet',
  SPORTS_BAR = 'Bar des sports',
  CABARET = 'Cabaret'
}

export interface IGeoPoint {
  type: string
  coordinates: [number, number]
}

export class ArtistEntity {
  about: string | null
  image: string | null
  name: string | null
}

export interface IArtist {
  about: string | null
  image: string | null
  name: string | null
}

export interface IStartEnd {
  start: number | null
  end: number | null
}

export interface IHours {
  mon: [IStartEnd] | null
  tue: [IStartEnd] | null
  wed: [IStartEnd] | null
  thu: [IStartEnd] | null
  fri: [IStartEnd] | null
  sat: [IStartEnd] | null
  sun: [IStartEnd] | null
}
export interface IHoursFormatted {
  mon: string | null
  tue: string | null
  wed: string | null
  thu: string | null
  fri: string | null
  sat: string | null
  sun: string | null
}

class StartEndSchema {
  @Expose()
  start: number

  @Expose()
  end: number
}

export class HoursClass {
  @Expose()
  @Type(() => StartEndSchema)
  mon: [IStartEnd]

  @Expose()
  @Type(() => StartEndSchema)
  tue: [IStartEnd]

  @Expose()
  @Type(() => StartEndSchema)
  wed: [IStartEnd]

  @Expose()
  @Type(() => StartEndSchema)
  thu: [IStartEnd]

  @Expose()
  @Type(() => StartEndSchema)
  fri: [IStartEnd]

  @Expose()
  @Type(() => StartEndSchema)
  sat: [IStartEnd]

  @Expose()
  @Type(() => StartEndSchema)
  sun: [IStartEnd]
}
export class HoursFormattedClass {
  @Expose()
  mon: string

  @Expose()
  tue: string

  @Expose()
  wed: string

  @Expose()
  thu: string

  @Expose()
  fri: string

  @Expose()
  sat: string

  @Expose()
  sun: string
}

export interface IContacts {
  phone: string
  email: string
}

export class ContactsClass {
  @Expose()
  phone: string
  @Expose()
  email: string
}

export type PartialPlace = Pick<IPlace, 'id' | 'name' | 'address'>
export type PartialEvent = Pick<
  IEvent,
  'id' | 'name' | 'place' | 'cover' | 'beginAt' | 'minPrice'
>

export interface ISocial {
  dice: string
  website: string
  instagram: string
  soundcloud: string
  spotify: string
  facebook: string
  twitter: string
  tiktok: string
  whatsApp: string
  messenger: string
  discord: string
}

export class SocialClass {
  @Expose()
  dice: string
  @Expose()
  website: string
  @Expose()
  instagram: string
  @Expose()
  soundcloud: string
  @Expose()
  spotify: string
  @Expose()
  facebook: string
  @Expose()
  twitter: string
  @Expose()
  tiktok: string
  @Expose()
  whatsApp: string
  @Expose()
  messenger: string
  @Expose()
  discord: string
}

export interface ISlug {
  shotgun: string
  dice: string
  facebook: string
  billetreduc: string
  schlouk: string
  google: string
}

export class SlugClass {
  @Expose()
  shotgun: string
  @Expose()
  dice: string
  @Expose()
  facebook: string
  @Expose()
  billetreduc: string
  @Expose()
  schlouk: string
  @Expose()
  google: string
}

export interface IDrink {
  name: string
  type: string
  details: string
  standardPrice: string
  happyPrice: string
}

export class DrinkClass {
  @Expose()
  name: string
  @Expose()
  type: string
  @Expose()
  details: string
  @Expose()
  standardPrice: string
  @Expose()
  happyPrice: string
}

export type BarType = {
  slug: string
  name: string
  icon: string
}

export interface IDrinkBestPrices {
  beer: number
  cocktail: number
  wine: number
  soft: number
}

export interface IPlace {
  id: string
  name: string
  desc: string
  location: IGeoPoint
  cover: string
  logo: string
  photos: string[]
  hours: IHours
  address: string
  slugs: ISlug
  contacts: IContacts
  social: ISocial
  verificationStatus: typeof VERIFICATION_STATUS
  price: typeof PRICE_RANGE
  followersCount: number
  event: PartialEvent[]
  categories: (typeof PLACE_TYPES)[]
  subCategories: (typeof PLACE_SUB_TYPES)[]
  createdBy: IUser
}

export interface IBar extends IPlace {
  happyHours: IHours
  menu: string
  drinks: [IDrink]
  bestPrice: Record<'beer' | 'cocktail' | 'wine' | 'soft', number>
}

export interface IEvent {
  id: string
  name: string
  desc: string
  descEN: string
  descEmbedding: number[]
  location: IGeoPoint
  cover: string
  photos: string[]
  beginAt: Date
  endAt: Date
  lineup: [IArtist]
  minPrice: number
  maxPrice: number
  followersCount: number
  slugs: ISlug
  place: PartialPlace
  categories: (typeof EVENT_TYPES)[]
  subCategories: (typeof EVENT_SUB_TYPES)[]
  active: boolean
  private: boolean
  createdBy: string
}

export interface ITopic {
  id: string
  name: string
  cover: string
  date: string
  type: string
  content: string[]
  createdBy: string
}

export interface IUser {
  id: string
  name: string
  desc: string
  location: IGeoPoint
  cover: string
  address: string
  role: typeof ROLE
  places: PartialPlace[]
  followersCount: number
  slugs: ISlug
  contacts: IContacts
  social: ISocial
  events: PartialEvent[]
}
