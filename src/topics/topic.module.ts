import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { TopicsController } from './topic.controller'
import { TopicsService } from './topic.service'
import { Topic, TopicSchema } from './topic.schema'
import { User, UsersSchema } from 'src/user/user.schema'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Topic.name, schema: TopicSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UsersSchema }])
  ],
  controllers: [TopicsController],
  providers: [TopicsService],
  exports: [TopicsService]
})
export class TopicsModule {}
