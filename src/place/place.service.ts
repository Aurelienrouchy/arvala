import { Model } from 'mongoose'
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Place, PlaceDocument } from './place.schema'
import { CreatePlaceDto, PlaceEntity, PlaceEntityMinimize } from './place.dto'
import { plainToClass } from 'class-transformer'
import { PLACE_TYPES } from 'src/utils/types'
import axios from 'axios'
import { Event, EventDocument } from 'src/event/event.schema'
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: 'dg7zxj4gf',
  api_key: '179513934118298',
  api_secret: '2ScsDltXftEBOB6tkVAe2MM4Ab0'
})

@Injectable({})
export class PlacesService {
  constructor(
    @InjectModel(Place.name) private placesRepository: Model<PlaceDocument>,
    @InjectModel(Event.name) private eventsRepository: Model<EventDocument>
  ) {}

  async create(dto: CreatePlaceDto): Promise<PlaceEntity> {
    const isExist =
      (await this.placesRepository.find({ name: dto.name }).count()) > 0

    if (isExist) {
      throw new HttpException(
        `Une place avec le meme nom existe deja`,
        HttpStatus.CONFLICT
      )
    }

    const place = await new this.placesRepository(dto).save()

    return plainToClass(PlaceEntity, place, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true
    })
  }

  async findNear(
    latitude: number,
    longitude: number,
    distance: number,
    types: (typeof PLACE_TYPES)[keyof typeof PLACE_TYPES][],
    limit = 10
  ): Promise<PlaceEntityMinimize[]> {
    if (limit <= 0) {
      throw new BadRequestException('Limit must be a positive number')
    }
    if (latitude < -90 || latitude > 90) {
      throw new BadRequestException('Latitude must be between -90 and 90')
    }
    if (longitude < -180 || longitude > 180) {
      throw new BadRequestException('Longitude must be between -180 and 180')
    }
    const places = await this.placesRepository
      .aggregate([
        {
          $geoNear: {
            near: {
              type: 'Point',
              coordinates: [latitude, longitude]
            },
            distanceField: 'distance',
            maxDistance: distance
          }
        },
        {
          $match: {
            categories: {
              $in: types
            },
            location: { $ne: null }
          }
        }
      ])
      .sort({ distance: 1 })
      .limit(20)
      .exec()

    return places.map((place) =>
      plainToClass(PlaceEntityMinimize, place, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true
      })
    )
  }

  async findClubs(
    latitude: number,
    longitude: number,
    distance: number,
    limit = 10
  ): Promise<PlaceEntityMinimize[]> {
    if (limit <= 0) {
      throw new BadRequestException('Limit must be a positive number')
    }
    if (latitude < -90 || latitude > 90) {
      throw new BadRequestException('Latitude must be between -90 and 90')
    }
    if (longitude < -180 || longitude > 180) {
      throw new BadRequestException('Longitude must be between -180 and 180')
    }
    const places = await this.placesRepository
      .aggregate([
        {
          $geoNear: {
            near: {
              type: 'Point',
              coordinates: [latitude, longitude]
            },
            distanceField: 'distance',
            maxDistance: distance
          }
        },
        {
          $match: {
            categories: PLACE_TYPES.NIGHT_CLUB
          }
        }
      ])
      .sort({ distance: 1 })
      .exec()

    return places.map((place) =>
      plainToClass(PlaceEntityMinimize, place, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true
      })
    )
  }

  async findBars(
    latitude: number,
    longitude: number,
    types: string,
    distance = 10000,
    limit = 10
  ): Promise<PlaceEntityMinimize[]> {
    if (limit <= 0) {
      throw new BadRequestException('Limit must be a positive number')
    }
    if (latitude < -90 || latitude > 90) {
      throw new BadRequestException('Latitude must be between -90 and 90')
    }
    if (longitude < -180 || longitude > 180) {
      throw new BadRequestException('Longitude must be between -180 and 180')
    }

    const query = {
      $match: {
        categories: 'bar'
      }
    }

    if (types) {
      query.$match['subCategories'] = { $in: types.split(',') }
    }

    const places = await this.placesRepository
      .aggregate([
        {
          $geoNear: {
            near: {
              type: 'Point',
              coordinates: [latitude, longitude]
            },
            distanceField: 'distance',
            maxDistance: distance
          }
        },
        query
      ])
      .sort({ distance: 1 })
      .exec()

    return places.map((place) =>
      plainToClass(PlaceEntityMinimize, place, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true
      })
    )
  }

  async findOneById(id: string): Promise<PlaceEntity> {
    try {
      const place = await this.placesRepository
        .findById(id)
        .populate('events')
        .exec()

      if (place) {
        return plainToClass(PlaceEntity, place, {
          excludeExtraneousValues: true,
          enableImplicitConversion: true
        })
      }
    } catch (err) {
      console.log(err)
    }

    throw new HttpException(`Place ${id} not found`, HttpStatus.NOT_FOUND)
  }

  async find(): Promise<PlaceEntity[]> {
    const places = await this.placesRepository.find({}).exec()
    if (places) {
      return places.map((place) =>
        plainToClass(PlaceEntity, place, {
          excludeExtraneousValues: true,
          enableImplicitConversion: true
        })
      )
    }

    throw new HttpException(`Places not found`, HttpStatus.NOT_FOUND)
  }

  async findByFilters(
    filters: Partial<PlaceEntity> = {}
  ): Promise<PlaceEntity[]> {
    try {
      const places = await this.placesRepository.find(filters).exec()

      return places.map((event) =>
        plainToClass(PlaceEntity, event, {
          excludeExtraneousValues: true,
          enableImplicitConversion: true
        })
      )
    } catch (error) {
      throw new HttpException(`Places not found`, HttpStatus.NOT_FOUND)
    }
  }

  async getByName(name: string): Promise<PlaceEntityMinimize[]> {
    const places = await this.placesRepository
      .find({ name: { $regex: name, $options: 'i' } })
      .limit(10)

    return places.map((event) =>
      plainToClass(PlaceEntityMinimize, event, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true
      })
    )
  }

  async getDiceVenuesOfParis() {
    try {
      const { data } = await axios.get('https://api.dice.fm/venues')

      return data.venues?.filter(
        (venue) => venue.location.city.name === 'Paris'
      )
    } catch (err) {
      console.log(err.response.data)
    }
  }

  async getDiceVenueProfile(slug: string) {
    try {
      const { data } = await axios.get(
        'https://api.dice.fm/venue_profiles/slug/' + slug
      )

      return data.venue
    } catch (err) {
      console.log({ response: err.response.data, slug })
    }
  }

  async saveDicePlace(slug: string): Promise<PlaceDocument> {
    try {
      const isExist = await this.placesRepository
        .findOne({
          'slugs.dice': slug
        })
        .lean()

      if (isExist) {
        return
      }

      const details = await this.getDiceVenueProfile(slug)

      if (!details) {
        return
      }

      const venueToRecord = {
        name: details.name,
        desc: details?.description || null,
        location: {
          type: 'Point',
          coordinates: [details.location.lat, details.location.lng]
        },
        cover: details?.cover_image?.url || null,
        address: details?.address || null,
        slugs: {
          dice: details.slug
        },
        photos: [details?.image?.url || null],
        social: {
          dice: details.slug,
          website: details.links.website,
          instagram: details.links.instagram,
          facebook: details.links.facebook
        },
        contacts: {
          phone: details?.contacts?.phone || null,
          email: details?.contacts?.email || null
        },
        verificationStatus: 0,
        price: null,
        categories: ['LIVE_MUSIC_VENUE'],
        createdBy: '63dfad3dc47e14d030fc180a'
      }

      try {
        return await new this.placesRepository(venueToRecord).save()
      } catch (err) {
        console.log(err)
      }
    } catch (err) {
      console.log(err)
    }
  }

  async saveDicePlaces() {
    try {
      const venues = await this.getDiceVenuesOfParis()

      for (const venue of venues) {
        await this.saveDicePlace(venue.bundle_url)
      }
    } catch (err) {
      console.log(err)
    }
  }

  async updateOneById(
    id: string,
    place: Partial<CreatePlaceDto>
  ): Promise<PlaceEntity> {
    const updatePlace = await this.placesRepository
      .findByIdAndUpdate(id, place, { new: true })
      .exec()

    if (updatePlace) {
      return plainToClass(PlaceEntity, updatePlace, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true
      })
    }

    throw new HttpException(`Place ${id} not found`, HttpStatus.NOT_FOUND)
  }

  async deleteOneById(id: string) {
    await this.placesRepository.findByIdAndRemove(id)

    // if (deletedPlace) {
    //   return plainToClass(PlaceEntity, deletedPlace, {
    //     excludeExtraneousValues: true,
    //     enableImplicitConversion: true
    //   })
    // }

    // throw new HttpException(`Place ${id} not found`, HttpStatus.NOT_FOUND)
  }
}
