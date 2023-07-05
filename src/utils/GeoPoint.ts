import { Prop } from '@nestjs/mongoose'
import { Expose } from 'class-transformer'

export class GeoPoint {
  @Prop({
    type: String,
    enum: ['Point'],
    required: true
  })
  type: string

  @Prop({
    type: [Number],
    required: true
  })
  coordinates: [number, number]
}

export class GeoPointEntity {
  @Expose()
  type: [string]

  @Expose()
  coordinates: [number, number]
}
