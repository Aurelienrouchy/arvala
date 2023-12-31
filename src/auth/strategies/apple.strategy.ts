import { AuthGuard, PassportStrategy } from '@nestjs/passport'
import { Strategy, Profile } from '@arendajaelu/nestjs-passport-apple'
import { Injectable } from '@nestjs/common'
import path from 'path'

@Injectable()
export class AppleStrategy extends PassportStrategy(Strategy, 'apple') {
  constructor() {
    super({
      clientID: 'com.aurelienrouchy.evenly1',
      teamID: 'B6D5JY9LKV',
      callbackURL: 'http://localhost:3000/auth/apple/callback',
      keyID: 'MZRXMPCH56',
      keyFilePath: path.join(
        process.cwd(),
        'src/auth/keys/AuthKey_MZRXMPCH56.p8'
      )
    })
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile
  ) {
    console.log(_accessToken, _refreshToken, profile)

    return {
      emailAddress: profile.email,
      firstName: profile.name?.firstName || '',
      lastName: profile.name?.lastName || ''
    }
  }
}

@Injectable()
export class AppleOAuthGuard extends AuthGuard('apple') {}
