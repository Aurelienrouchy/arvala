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
import { CloudinaryService } from 'src/cloudinary/cloudinary.service'
import { Cron } from '@nestjs/schedule'
import { BAR_TYPES, CONCERT_TAGS, DJ_TAGS } from './types'
import { writeFile } from 'fs'

cloudinary.config({
  cloud_name: 'dg7zxj4gf',
  api_key: '179513934118298',
  api_secret: '2ScsDltXftEBOB6tkVAe2MM4Ab0'
})

@Injectable({})
export class PlacesService {
  constructor(
    @InjectModel(Place.name) private placesRepository: Model<PlaceDocument>,
    @InjectModel(Event.name) private eventsRepository: Model<EventDocument>,
    private cloudinary: CloudinaryService
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
            distanceField: 'distance'
          }
        },
        {
          $match: {
            categories: 'bar'
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
    const places = await this.placesRepository.find({
      name: { $regex: name, $options: 'i' }
    })

    return places.map((place) =>
      plainToClass(PlaceEntity, place, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true
      })
    )
  }

  async getShotGunPlaceFromSlug(slug: string) {
    try {
      const { data } = await axios.post(
        'https://b2c-api.shotgun.live/api/graphql',
        {
          query: `
    			query organizerVenue($slug: ID!) {
                      dealer(id: $slug) {
                          slug
                          name
                          logo
                          cover
                          description
                          contactEmail
                          website
                          facebookId
                          instagramId
                          soundcloudId
                          spotifyId
                          twitterId
                          tiktokId
                          telegramId
                          whatsAppId
                          messengerId
                          discordId
                          instagramBroadcastId
                          youtubeId
                          tags {
                            name
                          }
                          geolocation {
                              id
                              lat
                              lng
                              venue
                              street
                          }
                          totalFollowing
                      }
                    }`,
          variables: { slug }
        }
      )
      return data.data.dealer
    } catch (err) {
      throw new HttpException(
        `Shotgun place from slug ${slug} not found`,
        HttpStatus.NOT_FOUND
      )
    }
  }

  async getByName(name: string): Promise<PlaceEntityMinimize[]> {
    const events = await this.eventsRepository
      .find({ name: { $regex: name, $options: 'i' } })
      .limit(10)

    return events.map((event) =>
      plainToClass(PlaceEntityMinimize, event, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true
      })
    )
  }

  async getShotGunEventsList() {
    try {
      const { data } = await axios.post(
        'https://b2c-api.shotgun.live/api/graphql',
        {
          query: `
          query events($filter: EventFilterInput, $page: Page, $areaId: String) {
                      events(
                        filter: $filter
                        page: $page
                        areaId: $areaId
                      ) {
                        slug
                        startTime
                        endTime
                        description
                        isFestival
                        name
                        artworks(roles: [cover, coverVertical, trailer]) {
                            role
                            originalUrl
                        }
                        tags {
                            name
                        }
                        dealer {
                            slug
                            tags {
                              name
                            }
                        }
                        cohostingDealers {
                            slug
                        }
                        artists {
                          avatar
                          name
                        }
                        isSoldOut
                        minTicketPrice
                        geolocation {
                            lat
                            lng
                            street
                            venue
                        }
                        totalInterestedOrGoing
                      }
                    }`,
          variables: {
            filter: {
              upcoming: true
            },
            page: {
              take: 20000,
              skip: 0
            },
            areaId: '1'
          }
        }
      )

      return data.data.events
    } catch (err) {
      throw new HttpException(
        `Shotgun events list not found`,
        HttpStatus.NOT_FOUND
      )
    }
  }

  async saveShotgunEvents() {
    const events = await this.getShotGunEventsList()

    const eventsSaved = []
    let count = 0

    for (const event of events) {
      const isExist = await this.eventsRepository
        .findOne({
          'slugs.shotgun': event.slug
        })
        .lean()

      if (isExist) {
        eventsSaved.push(isExist)

        continue
      }

      const cover = event.artworks?.find(
        (e: { role: string; originalUrl: string }) =>
          e.role === 'cover' && !e.originalUrl.includes('.mp4')
      )?.originalUrl

      const subCategories = event.tags.map((tag: { name: string }) => tag.name)

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
        address: event.geolocation?.street || null,
        followersCount: event.totalInterestedOrGoing || 0,
        createdBy: '63dfad3dc47e14d030fc180a'
      }

      try {
        const eventSaved = await this.eventsRepository.create(eventToRecord)

        eventsSaved.push(eventSaved)

        count++
      } catch (error) {
        throw new HttpException(
          {
            message: `Error on SAVE: ${event.slug}`,
            error
          },
          HttpStatus.BAD_REQUEST
        )
      }
    }

    console.log(`SHOTGUN: created: ${count}`)

    return eventsSaved
  }

  @Cron('5 01 * * *')
  async saveShotgunPlace() {
    const events = await this.saveShotgunEvents()
    let newPlacesCount = 0
    let placesCount = 0

    const inconnu = []

    for (const event of events) {
      let placeToUpdate

      const placeFromName = event.place?.name
        ? await this.placesRepository.findOne({
            name: {
              $regex: event.place.name,
              $options: 'i'
            }
          })
        : null

      if (placeFromName) {
        placeToUpdate = placeFromName
      } else {
        const placeFromAddress = event.place?.address
          ? await this.placesRepository.findOne({
              address: {
                $regex: event.place?.address.replace(', France', ''),
                $options: 'i'
              }
            })
          : null

        if (placeFromAddress) {
          placeToUpdate = placeFromAddress
        }
      }

      if (placeToUpdate) {
        try {
          await this.placesRepository.findOneAndUpdate(
            { _id: placeToUpdate._id },
            {
              $addToSet: {
                events: event._id
              }
            },
            { new: true }
          )

          placesCount++
        } catch (error) {
          throw new HttpException(
            {
              message: `Error with place: ${placeToUpdate.id} to UPDATE`,
              error
            },
            HttpStatus.NOT_FOUND
          )
        }
      } else {
        try {
          await this.placesRepository.findOneAndUpdate(
            {
              name: 'Inconnu'
            },
            {
              $addToSet: {
                events: event._id
              }
            },
            {
              upsert: true
            }
          )
          inconnu.push(event)
          newPlacesCount++
        } catch (err) {
          throw new HttpException(
            `Error with place: ${placeToUpdate.id} not CREATE`,
            HttpStatus.NOT_FOUND
          )
        }
      }
    }

    writeFile(`./data.json`, JSON.stringify(inconnu, null, 2), (error: any) => {
      if (error) {
        console.log('An error has occurred ', error)
        return
      }
      console.log('Shotgun Inconnu OK')
    })

    return {
      eventCount: events.length,
      Inconnu: newPlacesCount,
      placesCount
    }
  }

  async saveDiceEvents() {
    const eventsSaved = []
    let count = 0
    let created = 0
    let doublon = 0

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
            count++
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

              doublon++

              continue
            }

            const coverOriginalUrl =
              event.images?.landscape ||
              event.images?.portrait ||
              event.images?.square

            const cover = coverOriginalUrl
              ? await this.cloudinary.uploadImageUrlToCloudinary(
                  coverOriginalUrl
                )
              : null

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
              cover,
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
              createdBy: '63dfad3dc47e14d030fc180a'
            }

            try {
              const eventSaved = await this.eventsRepository.create(
                eventToRecord
              )

              eventsSaved.push(eventSaved)

              created++
            } catch (error) {
              // throw new HttpException(
              //   {
              //     message: `Error on SAVE: ${event}`,
              //     error
              //   },
              //   HttpStatus.BAD_REQUEST
              // )
            }
          }
        }
      }
    }
    console.log(
      `DICE: created: ${created}, total: ${count}, doublon=${doublon}`
    )

    return eventsSaved
  }

  // const places = await this.placesRepository.find({})

  //   for (const place of places) {
  //     await this.placesRepository.findByIdAndUpdate(place._id, { events: [] })
  //   }

  @Cron('* 01 * * *')
  async saveDicePlace() {
    const events = await this.saveDiceEvents()
    let newPlacesCount = 0
    let placesCount = 0

    for (const event of events) {
      let placeToUpdate

      const placeFromName = event.place?.name
        ? await this.placesRepository.findOne({
            name: {
              $regex: event.place.name ?? '',
              $options: 'i'
            }
          })
        : null

      if (placeFromName) {
        placeToUpdate = placeFromName
      } else {
        const placeFromAddress = event.place?.address
          ? await this.placesRepository.findOne({
              address: {
                $regex: event.place.address.replace(', France', ''),
                $options: 'i'
              }
            })
          : null

        if (placeFromAddress) {
          placeToUpdate = placeFromAddress
        }
      }

      if (placeToUpdate) {
        try {
          await this.placesRepository.findOneAndUpdate(
            { _id: placeToUpdate._id },
            {
              $addToSet: {
                events: event._id
              }
            }
          )

          placesCount++
        } catch (error) {
          throw new HttpException(
            {
              message: `Error with place: ${placeToUpdate.id} to UPDATE`,
              error
            },
            HttpStatus.NOT_FOUND
          )
        }
      } else {
        try {
          await this.placesRepository.findOneAndUpdate(
            {
              name: 'Inconnu'
            },
            {
              $addToSet: {
                events: event._id
              }
            },
            {
              upsert: true
            }
          )

          newPlacesCount++
        } catch (err) {
          throw new HttpException(
            `Error with place: ${placeToUpdate.id} not CREATE`,
            HttpStatus.NOT_FOUND
          )
        }
      }
    }

    return {
      eventCount: events.length,
      Inconnu: newPlacesCount,
      placesCount
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
