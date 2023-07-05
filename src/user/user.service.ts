import { Model } from 'mongoose'
import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { User, UserDocument } from './user.schema'
import { CreateGoogleUserDto } from './create-user.dto'
import { GeoPoint } from 'src/utils/GeoPoint'
import { UserEntity } from './user-dto'
import { plainToClass } from 'class-transformer'

@Injectable({})
export class UserService {
  constructor(
    @InjectModel(User.name) private userRepository: Model<UserDocument>
  ) {}

  async create(user: CreateGoogleUserDto): Promise<UserEntity> {
    const savedUser = await new this.userRepository(user).save()

    return plainToClass(UserEntity, savedUser, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true
    })
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
    const user = await this.userRepository.findById(id)
    if (user) {
      return plainToClass(UserEntity, user, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true
      })
    }

    throw new HttpException(`User ${id} not found`, HttpStatus.NOT_FOUND)
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
    user: Partial<User>
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
