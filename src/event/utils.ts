import { HttpException, HttpStatus } from '@nestjs/common'
import axios from 'axios'

export const getShotGunEventsList = async () => {
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
