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
import { UserEntity, UserEntityMinimize } from '../user/user.dto'
import { Place, PlaceDocument } from 'src/place/place.schema'
import { PlaceEntity, PlaceEntityMinimize } from 'src/place/place.dto'
import axios from 'axios'
import { CONCERT_TAGS, DJ_TAGS } from 'src/place/types'
import { PlacesService } from 'src/place/place.service'
import { Cron } from '@nestjs/schedule'
@Injectable()
export class EventsService {
  constructor(
    @InjectModel(Event.name) private eventsRepository: Model<EventDocument>,
    @InjectModel(Place.name) private placesRepository: Model<PlaceDocument>,
    @InjectModel(User.name) private userRepository: Model<UserDocument>,
    private placesService: PlacesService
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
    today.setHours(today.getHours() - 5)
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
    today.setHours(today.getHours() - 5)
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

  async getEvents(
    coordinates: [number, number],
    start: string,
    end: string,
    types: string,
    categories: string,
    limit = 1000,
    maxDistance = 10000
  ): Promise<EventEntityMinimize[]> {
    const today = new Date()
    today.setHours(today.getHours() - 5)

    const query = {
      categories
    }

    query['beginAt'] = {
      $gte: start ? new Date(start) : today
    }

    if (end) {
      const finish = new Date(end)
      finish.setDate(finish.getDate() + 1)

      query['beginAt'] = {
        ...(query['beginAt'] || {}),
        $lt: finish
      }
    }

    if (types) {
      query['subCategories'] = { $in: types.split(',') }
    }

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
    today.setHours(today.getHours() - 5)

    try {
      const events = await this.eventsRepository.aggregate([
        {
          $geoNear: {
            near: {
              type: 'Point',
              coordinates: [lng, lat]
            },
            maxDistance: 10000,
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

  async searchEvents(
    search: string,
    start?: string,
    end?: string
  ): Promise<EventEntityMinimize[]> {
    const query = {
      name: {
        $regex: search,
        $options: 'i'
      }
    }

    query['beginAt'] = {
      $gte: start ? new Date(start) : new Date()
    }

    if (end) {
      const finish = new Date(end)
      finish.setDate(finish.getDate() + 1)

      query['beginAt'] = {
        ...(query['beginAt'] || {}),
        $lt: finish
      }
    }

    const events = await this.eventsRepository.find(query).limit(10)

    return events.map((event) =>
      plainToClass(EventEntityMinimize, event, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true
      })
    )
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
    const event = await this.eventsRepository
      .findById(id)
      .populate('createdBy')
      // .populate('createdBy', 'Place')
      .exec()

    if (event) {
      return plainToClass(EventEntity, event, {
        excludeExtraneousValues: true,
        enableImplicitConversion: false
      })
    }

    throw new HttpException(`Event ${id} not found`, HttpStatus.NOT_FOUND)
  }

  async getShotgunEventsFromOrgaId(dealerId: string) {
    try {
      const { data } = await axios.post(
        'https://b2c-api.shotgun.live/api/graphql',
        {
          query: `query events($filter: EventFilterInput, $page: Page, $areaId: String, $search: String, $sort: EventSortInput, $dealFilter: DealFilterInput) {
            events(
              filter: $filter
              page: $page
              areaId: $areaId
              search: $search
              sort: $sort
            ) {
              id
              ...EventListItem_event
              minTicketPrice(filter: $dealFilter)
            }
          }
          
          fragment EventListItem_event on Event {
            id
            slug
            description
            typeOfPlace
            webToAppUrl
            name
            featuredText
            artworks(roles: [cover, coverVertical, trailer]) {
              id
              role
              originalUrl
              blurDataUrl
            }
            cancelledAt
            startTime
            addressVisibility
            endTime
            timezone
            currency
            artists {
              avatar
              name
            }
            tags {
              id
              name
              typo
              category {
                id
                slug
              }
            }
            dealer {
              id
              name
              slug
              website
            }
            launchedAt
            isSoldOut
            nextSalesTime
            publicationStatus
            realityType {
              isReal
              isVirtual
            }
            geolocation {
              id
              street
              venue
              lat
              lng
              city {
                id
                name
                zipCode
                country {
                  id
                  slug
                  isoCode
                }
              }
            }
            totalInterestedOrGoing
            isWaitingListAvailable
            hasExternalDeals
          }`,
          variables: {
            filter: {
              upcoming: true,
              dealerId
            },
            sort: {
              criterion: 'START_TIME',
              order: 'ASC'
            },
            page: {
              take: 200,
              skip: 0
            }
          }
        }
      )

      return data.data.events
    } catch (err) {
      console.log(err)
    }
  }

  @Cron('0 2 * * *')
  async recordShotgunEvents() {
    const shotgunUsers = await this.userRepository.find({
      'slugs.shotgunId': { $ne: null }
    })

    for (const user of shotgunUsers) {
      const events = await this.getShotgunEventsFromOrgaId(user.slugs.shotgunId)

      for (const event of events) {
        const isExist = await this.eventsRepository
          .findOne({
            'slugs.shotgun': event.slug
          })
          .lean()

        if (isExist) {
          continue
        }

        const cover = event.artworks?.find(
          (e: { role: string; originalUrl: string }) =>
            e.role === 'cover' && !e.originalUrl.includes('.mp4')
        )?.originalUrl

        const subCategories = event.tags.map(
          (tag: { name: string }) => tag.name
        )

        const eventToRecord = {
          name: event.name,
          desc: event.description,
          location: {
            type: 'Point',
            coordinates: [event.geolocation.lat, event.geolocation.lng]
          },
          cover,
          lineup: event.artists?.map((artist: any) => ({
            about: null,
            image: artist?.avatar || null,
            name: artist?.name || null
          })),
          beginAt: event.startTime * 1000 || null,
          place: {
            name: event.geolocation?.venue || null,
            address: event.geolocation?.street || null
          },
          isSoldOut: event?.isSoldOut || false,
          slugs: { shotgun: event.slug },
          endAt: event.endTime * 1000 || null,
          minPrice: event?.minTicketPrice || 0,
          maxPrice: event?.price?.amount || 0,
          categories: ['club'],
          subCategories,
          url: event.webToAppUrl,
          address: event.geolocation?.street || null,
          followersCount: event.totalInterestedOrGoing || 0,
          createdBy: user._id,
          createdByModel: 'User'
        }

        try {
          const recordedEvent = await this.eventsRepository.create(
            eventToRecord
          )

          await this.userRepository.findOneAndUpdate(
            { _id: user._id },
            {
              $addToSet: {
                events: recordedEvent._id
              }
            },
            { new: true }
          )
        } catch (error) {
          console.log(`Error on SAVE: ${event.slug}`, error)
        }
      }
    }
  }
  @Cron('0 1 * * *')
  async recordDiceEvents() {
    for (const tag of [...CONCERT_TAGS, ...DJ_TAGS]) {
      const { data } = await axios.post('https://api.dice.fm/unified_search', {
        count: 2000000,
        lat: 48.864716,
        lng: 2.349014,
        tag
      })

      for (const section of data.sections) {
        if (section.events) {
          for (const event of section.events) {
            const subCategories = tag.split(':')[1]
            const isExist = await this.eventsRepository
              .findOne({
                'slugs.dice': event.perm_name
              })
              .lean()

            if (isExist) {
              await this.eventsRepository.findByIdAndUpdate(isExist._id, {
                $addToSet: { subCategories }
              })

              continue
            }

            let venue = await this.placesRepository.findOne({
              'slugs.dice': event.venues[0]?.perm_name
            })

            if (!venue) {
              venue = await this.placesService.saveDicePlace(
                event.venues[0]?.perm_name
              )

              if (!venue) {
                venue = await this.placesRepository.findOne({
                  address: event.venues[0]?.address
                })

                if (!venue) {
                  const venueToRecord = {
                    name: event.venues[0]?.name,
                    desc: null,
                    location: {
                      type: 'Point',
                      coordinates: [
                        event.venues[0]?.location.lat,
                        event.venues[0].location.lng
                      ]
                    },
                    cover: null,
                    address: event.venues[0]?.address || null,
                    slugs: {
                      dice: event.venues[0].perm_name
                    },
                    photos: [null],
                    social: {
                      dice: event.venues[0].perm_name
                    },
                    verificationStatus: 0,
                    price: null,
                    categories: ['LIVE_MUSIC_VENUE'],
                    createdBy: '63dfad3dc47e14d030fc180a'
                  }

                  try {
                    venue = await new this.placesRepository(
                      venueToRecord
                    ).save()
                  } catch (err) {
                    console.log(err)
                  }
                }
              }
            }

            const coverOriginalUrl =
              event.images?.landscape ||
              event.images?.portrait ||
              event.images?.square

            const eventToRecord = {
              name: event.name,
              desc: event.about.description,
              location: {
                type: 'Point',
                coordinates: [
                  event.venues[0].location.lat,
                  event.venues[0].location.lng
                ]
              },
              cover: coverOriginalUrl,
              lineup: event.summary_lineup?.top_artists?.map((artist: any) => ({
                about:
                  (artist?.about?.description
                    ? artist?.about?.description
                    : artist?.about) || null,
                image: artist?.image?.url || null,
                name: artist?.name || null
              })),
              beginAt: event?.dates?.event_start_date || null,
              place: {
                name: event.venues[0]?.name,
                address: event.venues[0]?.address
              },
              isSoldOut: event?.status === 'sold-out' || false,
              slugs: { dice: event.perm_name },
              endAt: event?.dates?.event_end_date || null,
              minPrice: event.price?.amount / 100 || 0,
              categories: ['concert'],
              subCategories,
              address: event.venues?.address || 'Paris',
              followersCount: 0,
              createdBy: venue._id,
              createdByModel: 'Place'
            }

            try {
              const recordedEvent = await this.eventsRepository.create(
                eventToRecord
              )
              await this.placesRepository.findOneAndUpdate(
                { _id: venue._id },
                {
                  $addToSet: {
                    events: recordedEvent._id
                  }
                },
                { new: true }
              )
            } catch (error) {
              console.log(error.response)
            }
          }
        }
      }
    }
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
