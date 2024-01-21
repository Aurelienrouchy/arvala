import {
  BadRequestException,
  Injectable,
  NotFoundException
} from '@nestjs/common'
import * as jwt from 'jsonwebtoken'
import { Model } from 'mongoose'
import { UserDocument, User } from 'src/user/user.schema'
import { InjectModel } from '@nestjs/mongoose'
import { RefreshToken, RefreshTokenDocument } from './auth.schema'
import { UserService } from 'src/user/user.service'
import { UserEntity } from 'src/user/user.dto'
import { plainToClass } from 'class-transformer'
import admin from 'firebase-admin'

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userRepository: Model<UserDocument>,
    @InjectModel(RefreshToken.name)
    private refreshTokenRepository: Model<RefreshTokenDocument>,
    private userService: UserService
  ) {}

  async googleAuth({
    token,
    name,
    age,
    gender
  }: {
    token: string
    name: string
    age: string
    gender: string
  }): Promise<{ user: UserEntity; accessToken: string; refreshToken: string }> {
    try {
      const googleUser = await admin.auth().verifyIdToken(token)

      const user = await this.findOrCreateUserGoogle({
        googleUser,
        name,
        age,
        gender
      })

      const tokens = this.getTokens(user._id.toString())

      await this.setCurrentRefreshToken(
        tokens.refreshToken,
        user._id.toString()
      )

      return {
        user: plainToClass(UserEntity, user, {
          excludeExtraneousValues: true,
          enableImplicitConversion: true
        }),
        ...tokens
      }
    } catch (error) {
      console.log(error)
      throw new BadRequestException('Failed to verify token')
    }
  }

  async getUserWithToken(
    token: string
  ): Promise<{ user: UserEntity; accessToken: string; refreshToken: string }> {
    try {
      const googleUser = await admin.auth().verifyIdToken(token)

      const user = await this.userRepository.findOne({
        'slugs.google': googleUser.sub
      })

      const tokens = this.getTokens(user._id.toString())

      await this.setCurrentRefreshToken(
        tokens.refreshToken,
        user._id.toString()
      )

      return {
        user: plainToClass(UserEntity, user, {
          excludeExtraneousValues: true,
          enableImplicitConversion: true
        }),
        ...tokens
      }
    } catch (error) {
      console.log(error)
      throw new BadRequestException('Failed to verify token')
    }
  }

  async setCurrentRefreshToken(refreshToken: string, userId: string) {
    await this.refreshTokenRepository.updateOne(
      { userId },
      {
        token: refreshToken,
        userId
      },
      { upsert: true }
    )
  }

  // Find or create user in database
  async findOrCreateUserGoogle({
    googleUser,
    name,
    age,
    gender
  }: any): Promise<User> {
    const user = await this.userRepository.findOne({
      'slugs.google': googleUser.sub
    })

    if (!user) {
      const newUser = new User({
        name,
        age,
        gender,
        slugs: {
          shotgun: null,
          dice: null,
          facebook: null,
          billetreduc: null,
          schlouk: null,
          google: googleUser.sub
        },
        contacts: {
          phone: null,
          email: googleUser.email
        },
        cover: googleUser.picture
      })

      return await new this.userRepository(newUser).save()
    }

    return user
  }

  async findUserIdWithRefreshToken(token: string): Promise<string> {
    const { userId } = await this.refreshTokenRepository.findOne({ token })

    if (userId) {
      return userId
    }

    throw new NotFoundException('Token with this id does not exist')
  }

  // Generate JWT access token with user information and secret key
  getTokens(userId: string): { accessToken: string; refreshToken: string } {
    const accessToken = jwt.sign({ userId }, process.env.JWT_ACCESS_SECRET, {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN
    })

    const refreshToken = jwt.sign(
      {
        userId
      },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN }
    )

    return { accessToken, refreshToken }
  }

  // Delete refresh token from database
  async deleteRefreshToken(user: User): Promise<void> {
    // Delete refresh token from database
    await this.refreshTokenRepository.deleteOne({ userId: user._id })
  }

  // Delete refresh token from database
  async deleteOneById(id: string): Promise<void> {
    try {
      await this.userRepository.findByIdAndDelete(id)
    } catch (err) {
      throw new NotFoundException('User not exist')
    }
  }
}
