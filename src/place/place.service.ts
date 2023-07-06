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

@Injectable({})
export class PlacesService {
  constructor(
    @InjectModel(Place.name) private placesRepository: Model<PlaceDocument>
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
    lng: number,
    lat: number,
    distance: number,
    types: (typeof PLACE_TYPES)[keyof typeof PLACE_TYPES][],
    limit = 10
  ): Promise<PlaceEntityMinimize[]> {
    if (limit <= 0) {
      throw new BadRequestException('Limit must be a positive number')
    }
    if (lat < -90 || lat > 90) {
      throw new BadRequestException('Latitude must be between -90 and 90')
    }
    if (lng < -180 || lng > 180) {
      throw new BadRequestException('Longitude must be between -180 and 180')
    }
    const places = await this.placesRepository
      .aggregate([
        {
          $geoNear: {
            near: {
              type: 'Point',
              coordinates: [lng, lat]
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
  ): Promise<PlaceEntity[]> {
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
          $match: {
            categories: {
              $in: [PLACE_TYPES.BEER_GARDEN]
            }
          }
        }
      ])
      .sort({ distance: 1 })
      // .limit(20)
      .exec()

    return places.map((place) =>
      plainToClass(PlaceEntity, place, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true
      })
    )
  }

  async findBars(
    latitude: number,
    longitude: number,
    distance: number,
    limit = 10
  ): Promise<PlaceEntity[]> {
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
          $match: {
            categories: PLACE_TYPES
          }
        }
      ])
      .sort({ distance: 1 })
      // .limit(20)
      .exec()

    return places.map((place) =>
      plainToClass(PlaceEntity, place, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true
      })
    )
  }

  async findOneById(id: string): Promise<PlaceEntity> {
    try {
      const place = await this.placesRepository.findById(id).exec()
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
      const events = await this.placesRepository.find(filters).exec()

      return events.map((event) =>
        plainToClass(PlaceEntity, event, {
          excludeExtraneousValues: true,
          enableImplicitConversion: true
        })
      )
    } catch (error) {
      throw new HttpException(`Events not found`, HttpStatus.NOT_FOUND)
    }
  }

  async findPlacesByName(name: string): Promise<PlaceEntity[]> {
    const regexp = new RegExp(name, 'i')
    const places = await this.placesRepository.find({ name: regexp }).exec()

    return places.map((place) =>
      plainToClass(PlaceEntity, place, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true
      })
    )
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
