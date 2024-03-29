import { Model } from 'mongoose'
import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Topic, TopicDocument } from './topic.schema'
import { plainToClass, plainToInstance } from 'class-transformer'
import { CreateTopicDto, TopicEntity, TopicEntityMinimize } from './topic.dto'

@Injectable({})
export class TopicsService {
  constructor(
    @InjectModel(Topic.name) private topicsRepository: Model<TopicDocument>
  ) {}

  async create(topicDto: CreateTopicDto): Promise<TopicEntity> {
    try {
      const isExist = await this.topicsRepository
        .findOne({ name: topicDto.name })
        .exec()

      if (isExist) {
        throw new HttpException(`Topic already exist`, HttpStatus.CONFLICT)
      }

      const savedTopic = await new this.topicsRepository(topicDto).save()

      return plainToClass(TopicEntity, savedTopic, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true
      })
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async findBarTopics(): Promise<TopicEntityMinimize[]> {
    try {
      const topics = await this.topicsRepository
        .find({ category: 'bar' })
        .exec()

      return topics.map((topic) =>
        plainToClass(TopicEntityMinimize, topic, {
          excludeExtraneousValues: true,
          enableImplicitConversion: true
        })
      )
    } catch (error) {
      throw new HttpException(`Topics not found`, HttpStatus.NOT_FOUND)
    }
  }

  async findClubTopics(): Promise<TopicEntityMinimize[]> {
    try {
      const topics = await this.topicsRepository
        .find({ category: 'club' })
        .exec()

      return topics.map((topic) =>
        plainToClass(TopicEntityMinimize, topic, {
          excludeExtraneousValues: true,
          enableImplicitConversion: true
        })
      )
    } catch (error) {
      throw new HttpException(`Topics not found`, HttpStatus.NOT_FOUND)
    }
  }

  async findByFilters(filters: Partial<TopicEntity>): Promise<TopicEntity[]> {
    try {
      const topics = await this.topicsRepository.find(filters).exec()

      return topics.map((topic) =>
        plainToClass(TopicEntity, topic, {
          excludeExtraneousValues: true,
          enableImplicitConversion: true
        })
      )
    } catch (error) {
      throw new HttpException(`Topics not found`, HttpStatus.NOT_FOUND)
    }
  }

  async findOneById(id: string): Promise<TopicEntity> {
    const topic = await (
      await this.topicsRepository.findById(id).exec()
    ).populate('content')

    if (topic) {
      return plainToInstance(TopicEntity, topic, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true
      })
    }

    throw new HttpException(`Topic ${id} not found`, HttpStatus.NOT_FOUND)
  }

  async updateOneById(
    id: string,
    topic: Partial<TopicEntity>
  ): Promise<TopicEntity> {
    try {
      const updateTopic = await this.topicsRepository
        .findByIdAndUpdate(id, topic, { new: true })
        .exec()

      if (updateTopic) {
        return plainToClass(TopicEntity, updateTopic, {
          excludeExtraneousValues: true,
          enableImplicitConversion: true
        })
      }

      throw new HttpException(`Topic ${id} not found`, HttpStatus.NOT_FOUND)
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async deleteOneById(id: string): Promise<TopicEntity> {
    try {
      const deletedTopic = await this.topicsRepository
        .findByIdAndRemove(id)
        .exec()

      if (deletedTopic) {
        return plainToClass(TopicEntity, deletedTopic, {
          excludeExtraneousValues: true,
          enableImplicitConversion: true
        })
      }

      throw new HttpException(`Topic ${id} not found`, HttpStatus.NOT_FOUND)
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}
