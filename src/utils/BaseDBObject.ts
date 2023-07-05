import { instanceToPlain, Expose, Transform, Exclude } from 'class-transformer'
import { Types } from 'mongoose'

export class BaseDBObject {
  @Expose({ name: 'id' })
  @Transform(({ value }) => value && value.toString())
  _id: Types.ObjectId

  toJSON() {
    return instanceToPlain(this)
  }

  toString() {
    return JSON.stringify(this.toJSON())
  }
}

export abstract class AbstractEntity {
  @Exclude()
  public _id: number

  @Exclude()
  public createdAt: Date

  @Exclude()
  public updatedAt: Date
}
