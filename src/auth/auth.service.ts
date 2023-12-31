import fs from 'fs'
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UseFilters
} from '@nestjs/common'
import { OAuth2Client, GoogleAuth } from 'google-auth-library'
import * as jwt from 'jsonwebtoken'
import { Model } from 'mongoose'
import { UserDocument, User } from 'src/user/user.schema'
import { InjectModel } from '@nestjs/mongoose'
import { RefreshToken, RefreshTokenDocument } from './auth.schema'
import { UserService } from 'src/user/user.service'
import { ISlug } from 'src/utils/types'
import { UserEntity } from 'src/user/user.dto'
import { plainToClass } from 'class-transformer'
import AppleAuth from 'apple-auth'
import path from 'path'

const appleKey = fs
  .readFileSync(path.join(process.cwd(), 'src/auth/keys/AuthKey_MZRXMPCH56.p8'))
  .toString()
// new GoogleAuth({})

const auth = new AppleAuth(
  {
    client_id: 'com.aurelienrouchy.evenly',
    team_id: 'B6D5JY9LKV',
    redirect_uri: 'http://localhost:3000/auth/apple/callback',
    key_id: 'MZRXMPCH56',
    scope: 'name email'
  },
  appleKey,
  'text'
)

@Injectable()
export class AuthService {
  private readonly googleClient: OAuth2Client

  constructor(
    @InjectModel(User.name) private userRepository: Model<UserDocument>,
    @InjectModel(RefreshToken.name)
    private refreshTokenRepository: Model<RefreshTokenDocument>,
    private userService: UserService
  ) {
    // Initialize Google OAuth2 client
    this.googleClient = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    )
  }

  async googleAuth(
    idToken: string
  ): Promise<{ user: UserEntity; accessToken: string; refreshToken: string }> {
    try {
      const ticket = await this.googleClient.verifyIdToken({
        idToken
      })

      const googleUser = ticket.getPayload()

      if (!googleUser) {
        throw new NotFoundException('Bad google token')
      }

      const user = await this.findOrCreateUserGoogleUser(googleUser)

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
      throw new BadRequestException('Failed to verify token')
    }
  }

  async appleAuth(token: string) {
    console.log({ token })
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
  async findOrCreateUserGoogleUser(googleUser: any): Promise<User> {
    // Check if user with Google ID exists in database
    const user = await this.userRepository.findOne({
      'slugs.google': googleUser.sub
    })

    if (!user) {
      const newUser = new User({
        name: googleUser.name,
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
}
