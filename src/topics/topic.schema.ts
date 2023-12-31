import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, SchemaTypes, Types } from 'mongoose'
import { BaseDBObject } from '../utils/BaseDBObject'
import { ITopic } from 'src/utils/types'

export type TopicDocument = ITopic & Document

@Schema({ timestamps: true, versionKey: false })
export class Topic extends BaseDBObject {
  constructor(partial: Partial<TopicDocument>) {
    super()
    Object.assign(this, partial)
  }

  @Prop({
    type: String,
    required: true
  })
  name: string

  @Prop({
    type: String,
    required: true
  })
  cover: string

  @Prop({
    type: String,
    required: true
  })
  date: string

  @Prop({
    type: String,
    required: true,
    enum: ['Place', 'Event']
  })
  type: string

  @Prop({
    type: String,
    required: true,
    enum: ['bar', 'club']
  })
  category: string

  @Prop({
    type: [SchemaTypes.ObjectId],
    required: true,
    ref: 'Place'
  })
  content: Types.ObjectId[]

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User', require: true })
  createdBy: Types.ObjectId
}

export const TopicSchema = SchemaFactory.createForClass(Topic)
