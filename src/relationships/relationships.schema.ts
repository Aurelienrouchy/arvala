import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, SchemaTypes, Types } from 'mongoose'
import { BaseDBObject } from '../utils/BaseDBObject'

export type RelationshipDocument = Relationship & Document

@Schema({ timestamps: true, versionKey: false })
export class Relationship extends BaseDBObject {
  constructor(partial: Partial<Relationship>) {
    super()
    Object.assign(this, partial)
  }

  @Prop({
    type: String,
    required: true,
    enum: ['Place', 'Event']
  })
  type: string

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User', index: true })
  follower: Types.ObjectId

  @Prop({
    type: SchemaTypes.ObjectId,
    required: true,
    refPath: 'type'
  })
  following: Types.ObjectId
}

export const RelationshipSchema = SchemaFactory.createForClass(Relationship)
