import { Model } from 'mongoose'
import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { User, UserDocument } from './user.schema'
import { UserEntity } from './user.dto'
import { plainToClass } from 'class-transformer'
import axios from 'axios'

@Injectable({})
export class UserService {
  constructor(
    @InjectModel(User.name) private userRepository: Model<UserDocument>
  ) {}

  async create(user): Promise<UserEntity> {
    const isExist = await this.userRepository
      .findOne({ name: user.name })
      .exec()

    if (isExist) {
      throw new HttpException(`User already exist`, HttpStatus.CONFLICT)
    }

    const savedUser = await new this.userRepository(user).save()

    return plainToClass(UserEntity, savedUser, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true
    })
  }

  async findByFilters(filters: Partial<UserEntity>): Promise<UserEntity[]> {
    try {
      const users = await this.userRepository.find(filters).exec()

      return users.map((event) =>
        plainToClass(UserEntity, event, {
          excludeExtraneousValues: true,
          enableImplicitConversion: true
        })
      )
    } catch (error) {
      throw new HttpException(`Events not found`, HttpStatus.NOT_FOUND)
    }
  }

  async findAll(): Promise<UserEntity[]> {
    const users = await this.userRepository.find().exec()
    return users.map((user) =>
      plainToClass(UserEntity, user, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true
      })
    )
  }

  async findOneById(id: string): Promise<UserEntity> {
    console.log(id)
    const user = await this.userRepository.findById(id).populate('events')

    if (user) {
      return plainToClass(UserEntity, user, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true
      })
    }

    throw new HttpException(`User ${id} not found`, HttpStatus.NOT_FOUND)
  }

  async getShotgunOrgaFromEvents() {
    try {
      const { data } = await axios.post(
        'https://b2c-api.shotgun.live/api/graphql',
        {
          query: `query events($filter: EventFilterInput, $page: Page, $areaId: String) {
            events(
              filter: $filter
              page: $page
              areaId: $areaId
            ) {
                 slug
              startTime
              endTime
              webToAppUrl
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
                  id
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
                  id
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

      return data.data.events.map((event) => event.dealer)
    } catch (err) {
      console.log(err)
    }
  }

  async getShotgunOrgaSlugs() {
    try {
      const { data } = await axios.post(
        'https://b2c-api.shotgun.live/api/graphql',
        {
          query: `
				query organizers($input: DealersInput) {
          dealers(input: $input) {
            ...OrganizerListItem
          }
        }
        
        fragment OrganizerListItem on Dealer {
          id
          slug
          name
          logo
          logoBlurDataUrl
          cover
          coverBlurDataUrl
          totalFollowing
          totalNumberOfFutureEvents
          geolocation {
            id
            venue
            street
            city {
              id
              country {
                id
                slug
                isoCode
              }
            }
          }
        }`,
          variables: {
            input: {
              page: {
                skip: 0,
                take: 20000
              },
              sort: {
                criterion: 'TOTAL_FOLLOWING_COUNT',
                order: 'DESC'
              },
              filter: {
                hasUpdatedPage: true,
                hasPublishedEventLastYear: true,
                isNotBlacklisted: true,
                countrySlug: 'france',
                countryExclusionIds: null
              }
            }
          }
        }
      )

      return data.data.dealers
    } catch (err) {
      console.log(err)
    }
  }

  async getShotgunOrgaFromSlug(slug: string) {
    try {
      const { data } = await axios.post(
        'https://b2c-api.shotgun.live/api/graphql',
        {
          query: `query organizerVenue($slug: ID!) {
            dealer(id: $slug) {
              id
              ...EventOrganizerCard
              cover
              coverBlurDataUrl
              description
              shortDescription
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
              geolocation {
                id
                lat
                lng
                venue
                street
                city {
                  id
                  name
                  country {
                    id
                    slug
                    isoCode
                  }
                }
              }
              googleTagManagerId
              facebookPixelId
              facebookAccessToken
              pageArtistsDisplay
              totalFollowing
            }
          }
          
          fragment EventOrganizerCard on Dealer {
            slug
            name
            logo
            logoBlurDataUrl
            totalFollowing
            totalNumberOfFutureEvents
          }`,
          variables: {
            slug
          }
        }
      )

      return data.data.dealer
    } catch (err) {
      console.log({ err })
    }
  }

  async recordShotgunOrgas() {
    try {
      const dealers = await this.getShotgunOrgaFromEvents()

      for (const dealer of dealers) {
        const orga = await this.getShotgunOrgaFromSlug(dealer.slug)

        if (dealer.id) {
          const isExist = await this.userRepository
            .findOneAndUpdate(
              {
                'slugs.shotgun': dealer.slug
              },
              { 'slugs.shotgunId': dealer.id }
            )
            .lean()
        }
        // if (isExist) {
        //   continue
        // }

        // const userToRecord = {
        //   name: orga.name,
        //   cover: orga.cover,
        //   desc: orga.description,
        //   location: {
        //     type: 'Point',
        //     coordinates: [
        //       orga.geolocation?.lat || 48.864716,
        //       orga.geolocation?.lng || 2.349014
        //     ]
        //   },
        //   address: orga.geolocation?.street || null,
        //   role: ROLE.ORGA,
        //   followersCount: orga.totalFollowing,
        //   slugs: {
        //     shotgun: orga.slug,
        //     shotgunId: dealer.id
        //   },
        //   contacts: {
        //     email: orga.contactEmail
        //   },
        //   social: {
        //     website: orga.website,
        //     instagram: orga.instagramId,
        //     soundcloud: orga.soundcloudId,
        //     spotify: orga.spotifyId,
        //     facebook: orga.facebookId,
        //     twitter: orga.twitterId,
        //     tiktok: orga.tiktokId,
        //     whatsApp: orga.whatsAppId,
        //     messenger: orga.messengerId,
        //     discord: orga.discordId
        //   }
        // }

        // await this.create(userToRecord)
      }
    } catch (err) {
      console.log(err)
    }
  }

  async updateLocation(id: string, location: string[]): Promise<User> {
    if (!location) {
      return
    }
    return await this.userRepository.findOneAndUpdate(
      { _id: id },
      { location: { type: ['Point'], coordinates: location } },
      { new: true }
    )
  }

  async updateOneById(
    userId: string,
    user: Partial<UserEntity>
  ): Promise<UserEntity> {
    const updateUser = await this.userRepository
      .findByIdAndUpdate(userId, user, { new: true })
      .exec()

    if (updateUser) {
      return plainToClass(UserEntity, updateUser, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true
      })
    }

    throw new HttpException(`User ${user._id} not found`, HttpStatus.NOT_FOUND)
  }

  async deleteOneById(id: string): Promise<UserEntity> {
    const deletedUser = await this.userRepository.findByIdAndRemove(id).exec()

    if (deletedUser) {
      return plainToClass(UserEntity, deletedUser, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true
      })
    }

    throw new HttpException(`User ${id} not found`, HttpStatus.NOT_FOUND)
  }
}
