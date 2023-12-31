import { Model } from 'mongoose'
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Event, EventDocument } from './event.schema'
import { CreateEventDto, EventEntity, EventEntityMinimize } from './event.dto'
import { User, UserDocument } from 'src/user/user.schema'
import { plainToClass } from 'class-transformer'
import { UserEntity } from '../user/user.dto'
import { Place, PlaceDocument } from 'src/place/place.schema'
import { PlaceEntityMinimize } from 'src/place/place.dto'
@Injectable()
export class EventsService {
  constructor(
    @InjectModel(Event.name) private eventsRepository: Model<EventDocument>,
    @InjectModel(Place.name) private placesRepository: Model<PlaceDocument>,
    @InjectModel(User.name) private userRepository: Model<UserDocument>
  ) {}

  async create(eventDto: CreateEventDto): Promise<EventEntity> {
    const isExist = await this.eventsRepository
      .findOne({ name: eventDto.name })
      .exec()

    if (isExist) {
      throw new HttpException(
        `Event - EXISTE: ${eventDto.name}`,
        HttpStatus.CONFLICT
      )
    }

    const savedEvent = await new this.eventsRepository(eventDto).save()
    const { id, name, place, cover, beginAt, minPrice } = savedEvent

    await this.userRepository.findByIdAndUpdate(
      id,
      {
        $addToSet: { events: { id, name, place, cover, beginAt, minPrice } }
      },
      { new: true }
    )

    return plainToClass(EventEntity, savedEvent, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true
    })
  }

  async findNear(
    distance: number,
    coordinates: [number, number]
  ): Promise<EventEntityMinimize[]> {
    const events = await this.eventsRepository.aggregate([
      {
        $geoNear: {
          near: {
            type: 'Point',
            coordinates: coordinates
          },
          distanceField: 'distance',
          maxDistance: distance
        }
      }
    ])

    return events.map((event) =>
      plainToClass(EventEntityMinimize, event, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true
      })
    )
  }

  async getDailyEvents(
    maxDistance: number,
    coordinates: [number, number],
    limit = 7
  ): Promise<EventEntityMinimize[]> {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(tomorrow.getHours() + 4)

    const events = await this.eventsRepository.aggregate([
      {
        $geoNear: {
          near: {
            type: 'Point',
            coordinates
          },
          query: {
            beginAt: {
              $gte: today,
              $lt: tomorrow
            }
          },
          distanceField: 'distance',
          maxDistance
        }
      },
      {
        $match: {
          location: { $ne: null }
        }
      },
      { $sort: { distance: 1 } },
      { $limit: limit }
    ])

    return events.map((event) =>
      plainToClass(EventEntityMinimize, event, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true
      })
    )
  }

  async getByName(name: string): Promise<EventEntityMinimize[]> {
    const events = await this.eventsRepository
      .find({ name: { $regex: name, $options: 'i' } })
      .limit(10)

    return events.map((event) =>
      plainToClass(EventEntityMinimize, event, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true
      })
    )
  }

  async getWeeklyEvents(
    maxDistance: number,
    coordinates: [number, number],
    limit = 7
  ): Promise<EventEntityMinimize[]> {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 7)
    tomorrow.setHours(tomorrow.getHours() + 4)

    const events = await this.eventsRepository.aggregate([
      {
        $geoNear: {
          near: {
            type: 'Point',
            coordinates
          },
          query: {
            beginAt: {
              $gte: today,
              $lt: tomorrow
            }
          },
          distanceField: 'distance',
          maxDistance
        }
      },
      { $sort: { distance: 1 } },
      { $limit: limit }
    ])

    return events.map((event) =>
      plainToClass(EventEntityMinimize, event, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true
      })
    )
  }

  async getConcertsEvents(
    coordinates: [number, number],
    start: string,
    end: string,
    types: string,
    limit = 1000,
    maxDistance = 10000
  ): Promise<EventEntityMinimize[]> {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const query = {
      categories: 'concert'
    }

    if (start) {
      query['beginAt'] = {
        ...(query['beginAt'] || {}),
        $gte: new Date(start)
      }
    }

    if (end) {
      query['beginAt'] = {
        ...(query['beginAt'] || {}),
        $lt: new Date(end)
      }
    }

    if (types) {
      query['subCategories'] = { $in: types.split(',') }
    }

    console.log(query)

    const events = await this.eventsRepository.aggregate([
      {
        $geoNear: {
          near: {
            type: 'Point',
            coordinates
          },
          query,
          distanceField: 'distance',
          maxDistance
        }
      },
      { $sort: { distance: 1 } },
      { $limit: limit }
    ])

    console.log(events.length)

    return events.map((event) =>
      plainToClass(EventEntityMinimize, event, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true
      })
    )
  }

  async getMostPopularEventsNearUser(
    lng: number,
    lat: number,
    limit = 7
  ): Promise<EventEntityMinimize[]> {
    if (limit <= 0) {
      throw new BadRequestException('Limit must be a positive number')
    }
    if (lat < -90 || lat > 90) {
      throw new BadRequestException('Latitude must be between -90 and 90')
    }
    if (lng < -180 || lng > 180) {
      throw new BadRequestException('Longitude must be between -180 and 180')
    }
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    try {
      const events = await this.eventsRepository.aggregate([
        {
          $geoNear: {
            near: {
              type: 'Point',
              coordinates: [lng, lat]
            },
            distanceField: 'distance',
            query: {
              beginAt: {
                $gte: today
              }
            }
          }
        },
        { $sort: { followersCount: -1 } },
        { $limit: limit }
      ])

      return events.map((event) =>
        plainToClass(EventEntityMinimize, event, {
          excludeExtraneousValues: true,
          enableImplicitConversion: false
        })
      )
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  async searchEventsAndPlaces(
    search: string,
    start: Date,
    end: Date
  ): Promise<{ events: EventEntityMinimize[]; places: PlaceEntityMinimize[] }> {
    const places = await this.placesRepository
      .find({
        name: {
          $regex: search,
          $options: 'i'
        }
      })
      .limit(10)

    const events = await this.eventsRepository
      .find({
        name: {
          $regex: search,
          $options: 'i'
        },
        beginAt: {
          $gte: start,
          $lt: end
        }
      })
      .limit(10)

    return {
      events: events.map((event) =>
        plainToClass(EventEntityMinimize, event, {
          excludeExtraneousValues: true,
          enableImplicitConversion: true
        })
      ),
      places: places.map((event) =>
        plainToClass(PlaceEntityMinimize, event, {
          excludeExtraneousValues: true,
          enableImplicitConversion: true
        })
      )
    }
  }

  async getNewEvents(
    lng: number,
    lat: number,
    limit = 7
  ): Promise<EventEntityMinimize[]> {
    if (limit <= 0) {
      throw new BadRequestException('Limit must be a positive number')
    }
    if (lat < -90 || lat > 90) {
      throw new BadRequestException('Latitude must be between -90 and 90')
    }
    if (lng < -180 || lng > 180) {
      throw new BadRequestException('Longitude must be between -180 and 180')
    }

    try {
      const events = await this.eventsRepository
        .aggregate([
          {
            $geoNear: {
              near: {
                type: 'Point',
                coordinates: [lng, lat]
              },
              distanceField: 'distance',
              maxDistance: 10000
            }
          }
        ])
        .sort({ createdAt: -1 })
        .limit(limit)
        .exec()

      return events.map((event) =>
        plainToClass(EventEntityMinimize, event, {
          excludeExtraneousValues: true,
          enableImplicitConversion: true
        })
      )
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  async findAll(): Promise<EventEntity[]> {
    try {
      const events = await this.eventsRepository.find({}).exec()

      return events.map((event) =>
        plainToClass(EventEntity, event, {
          excludeExtraneousValues: true,
          enableImplicitConversion: true
        })
      )
    } catch (error) {
      throw new HttpException(`Events not found`, HttpStatus.NOT_FOUND)
    }
  }

  async findByFilters(filters: Partial<EventEntity>): Promise<EventEntity[]> {
    try {
      const events = await this.eventsRepository.find(filters).exec()

      return events.map((event) =>
        plainToClass(EventEntity, event, {
          excludeExtraneousValues: true,
          enableImplicitConversion: true
        })
      )
    } catch (error) {
      throw new HttpException(`Events not found`, HttpStatus.NOT_FOUND)
    }
  }

  async follow(user: UserEntity, eventId: string): Promise<EventEntity> {
    const isAlreadyFollowed = true
    // const isAlreadyFollowed = user.eventsLiked.some(
    //   (id) => id.toString() === eventId
    // )

    if (isAlreadyFollowed) {
      throw new HttpException(
        `Event ${eventId} is already followed`,
        HttpStatus.CONFLICT
      )
    }

    await this.userRepository.findByIdAndUpdate(user.id, {
      $addToSet: { eventsLiked: eventId }
    })

    return await this.eventsRepository.findByIdAndUpdate(
      eventId,
      {
        $inc: { followersCount: 1 },
        $addToSet: { followers: user.id }
      },
      { new: true }
    )
  }

  async unFollow(user: UserEntity, eventId: string): Promise<EventEntity> {
    const isAlreadyFollowed = true

    // const isAlreadyFollowed = user.eventsLiked.some((id) => {
    //   return id.toString() === eventId
    // })

    if (!isAlreadyFollowed) {
      throw new HttpException(
        `Event ${eventId} is not followed`,
        HttpStatus.NOT_FOUND
      )
    }

    await this.userRepository.findByIdAndUpdate(user.id, {
      $pull: { eventsLiked: eventId }
    })

    return this.eventsRepository.findByIdAndUpdate(
      eventId,
      {
        $inc: { followersCount: -1 },
        $pull: { followers: user.id }
      },
      { new: true }
    )
  }

  async findOneById(id: string): Promise<EventEntity> {
    const event = await this.eventsRepository.findById(id).exec()

    console.log(event)
    if (event) {
      return plainToClass(EventEntity, event, {
        excludeExtraneousValues: true,
        enableImplicitConversion: false
      })
    }

    throw new HttpException(`Event ${id} not found`, HttpStatus.NOT_FOUND)
  }

  async updateOneById(
    id: string,
    event: Partial<EventEntity>
  ): Promise<EventEntity> {
    const updateEvent = await this.eventsRepository
      .findByIdAndUpdate(id, event, { new: true })
      .exec()

    if (updateEvent) {
      return plainToClass(EventEntity, updateEvent, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true
      })
    }

    throw new HttpException(`Event ${id} not found`, HttpStatus.NOT_FOUND)
  }

  async deleteEventsInPlace() {
    const places = await this.placesRepository.find({ name: 'Inconnu' })
    for (const place of places) {
      await this.placesRepository.findByIdAndRemove(place._id)
      // for (const event of place.events) {
      //   const isExist = await this.eventsRepository.findOne({
      //     name: event.name
      //   })

      //   if (!isExist) {
      //     await this.placesRepository.findOneAndUpdate(
      //       { _id: place._id },
      //       {
      //         $pull: { events: { name: event.name } }
      //       },
      //       { upsert: true }
      //     )
      //   }
      // }
      try {
      } catch (error) {
        throw new HttpException(
          {
            message: `Error deleted`,
            error
          },
          HttpStatus.BAD_REQUEST
        )
      }
    }
  }

  async deleteOneById(id: string): Promise<Event> {
    const deletedEvent = await this.eventsRepository
      .findByIdAndRemove(id)
      .exec()

    if (deletedEvent) {
      return new Event(deletedEvent.toJSON())
    }

    throw new HttpException(`Event ${id} not found`, HttpStatus.NOT_FOUND)
  }
}
