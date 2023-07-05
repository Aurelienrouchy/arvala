import { Model, Types } from 'mongoose'
import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Event, EventDocument } from './event.schema'
import { CreateEventDto, EventEntity } from './event.dto'
import { User, UserDocument } from 'src/user/user.schema'
import { plainToClass } from 'class-transformer'
import { UserEntity } from '../user/user-dto'

@Injectable({})
export class EventsService {
  constructor(
    @InjectModel(Event.name) private eventsRepository: Model<EventDocument>,
    @InjectModel(User.name) private userRepository: Model<UserDocument>
  ) {}

  async create(eventDto: CreateEventDto): Promise<EventEntity> {
    // const isExist = await this.eventsRepository
    //   .find({
    //     organisation: eventDto.organisation,
    //     beginAt: eventDto.beginAt
    //   })
    //   .exec()

    // if (isExist) {
    //   throw new HttpException(`Event already exist`, HttpStatus.CONFLICT)
    // }

    const savedEvent = await new this.eventsRepository(eventDto).save()

    return plainToClass(EventEntity, savedEvent, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true
    })
  }

  async findNear(
    distance: number,
    coordinates: [number, number]
  ): Promise<EventEntity[]> {
    const events = await this.eventsRepository
      .aggregate([
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
      .exec()

    return events.map((event) =>
      plainToClass(EventEntity, event, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true
      })
    )
  }

  async follow(user: UserEntity, eventId: string): Promise<EventEntity> {
    const isAlreadyFollowed = user.eventsLiked.some(
      (id) => id.toString() === eventId
    )

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
    const isAlreadyFollowed = user.eventsLiked.some((id) => {
      return id.toString() === eventId
    })

    console.log(user)

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
    const foundEvent = await this.eventsRepository.findById(id).exec()
    if (foundEvent) {
      return plainToClass(EventEntity, foundEvent, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true
      })
    }

    throw new HttpException(`Event ${id} not found`, HttpStatus.NOT_FOUND)
  }

  async updateOneById(
    id: string,
    event: Partial<CreateEventDto>
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
