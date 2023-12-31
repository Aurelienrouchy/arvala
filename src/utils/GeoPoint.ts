import { Prop } from '@nestjs/mongoose'
import { Expose } from 'class-transformer'

export class GeoPoint {
  @Prop({
    type: String,
    enum: ['Point'],
    default: 'Point',
    required: true
  })
  type: string

  @Prop({
    type: [Number],
    default: [0, 0],
    required: true
  })
  coordinates: [number, number]
}

export class GeoPointEntity {
  @Expose()
  type: string

  @Expose()
  coordinates: [number, number]
}
