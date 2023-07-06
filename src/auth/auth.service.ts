// auth-response.dto.ts
export class AuthResponseDto {
  accessToken: string
  refreshToken: string
}

import { Injectable, NotFoundException } from '@nestjs/common'
import { OAuth2Client } from 'google-auth-library'
import * as jwt from 'jsonwebtoken'
import { Model } from 'mongoose'
import { UserDocument, User, PROVIDER_NAME } from 'src/user/user.schema'
import { InjectModel } from '@nestjs/mongoose'
import { RefreshToken, RefreshTokenDocument } from './auth.schema'
import { UserService } from 'src/user/user.service'
import { UserEntity } from '../user/user.dto'
import { plainToClass } from 'class-transformer'

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

  // Verify Google access token and return user information
  async googleAuth(
    googleToken: string
  ): Promise<{ user: UserEntity; accessToken: string; refreshToken: string }> {
    // Verify Google access token
    const ticket = await this.googleClient.verifyIdToken({
      idToken: googleToken,
      audience:
        '766840691282-pgl5d1dasfr07c8bjocnqr3r9fqju010.apps.googleusercontent.com'
    })

    const googleUser = ticket.getPayload()

    if (!googleUser) {
      throw new NotFoundException('Bad google token')
    }

    // Retrieve or create user in database
    const user = await this.findOrCreateUserGoogleUser(googleUser)

    const tokens = this.getTokens(user._id.toString())

    await this.setCurrentRefreshToken(tokens.refreshToken, user._id.toString())

    return {
      user: plainToClass(UserEntity, user, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true
      }),
      ...tokens
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
  async findOrCreateUserGoogleUser(googleUser: any): Promise<User> {
    // Check if user with Google ID exists in database
    const user = await this.userRepository.findOne({
      providerId: googleUser.sub
    })

    // if (!user) {
    //   const newUser = new User({
    //     name: googleUser.name,
    //     providerId: googleUser.sub,
    //     providerName: PROVIDER_NAME.GOOGLE,
    //     email: googleUser.email,
    //     logo: googleUser.picture
    //   })

    //   return await new this.userRepository(newUser).save()
    // }

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
