import { Model } from 'mongoose'
import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Place, PlaceDocument } from './place.schema'
import { CreatePlaceDto, PlaceEntity } from './place.dto'
import { plainToClass } from 'class-transformer'

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
    distance: number,
    coordinates: number[]
  ): Promise<PlaceEntity[]> {
    const places = await this.placesRepository
      .find({
        location: {
          $near: {
            $maxDistance: distance,
            $geometry: {
              type: 'Point',
              coordinates: coordinates
            }
          }
        }
      })
      .exec()
    return places.map((place) =>
      plainToClass(PlaceEntity, place, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true
      })
    )
  }

  async findOneById(id: string): Promise<PlaceEntity> {
    const place = await this.placesRepository.findById(id).exec()
    if (place) {
      return plainToClass(PlaceEntity, place, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true
      })
    }

    throw new HttpException(`Place ${id} not found`, HttpStatus.NOT_FOUND)
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

  async deleteOneById(id: string): Promise<PlaceEntity> {
    const deletedPlace = await this.placesRepository
      .findByIdAndRemove(id)
      .exec()

    if (deletedPlace) {
      return plainToClass(PlaceEntity, deletedPlace, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true
      })
    }

    throw new HttpException(`Place ${id} not found`, HttpStatus.NOT_FOUND)
  }
}
