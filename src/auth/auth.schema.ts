import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, SchemaTypes, Types } from 'mongoose'
import { BaseDBObject } from '../utils/BaseDBObject'

export interface RefreshTokenDocument extends Document {
  token: string
  userId: string
}

@Schema({ timestamps: true, versionKey: false })
export class RefreshToken extends BaseDBObject {
  constructor(partial: Partial<RefreshToken>) {
    super()
    Object.assign(this, partial)
  }

  @Prop({
    type: String,
    require: true
  })
  token: string

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User' })
  userId: Types.ObjectId
}

export const RefreshTokenSchema = SchemaFactory.createForClass(RefreshToken)
