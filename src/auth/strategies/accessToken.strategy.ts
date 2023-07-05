import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy, VerifiedCallback } from 'passport-jwt'

import { JwtPayload } from './jwt-payload.interface'
import { UserService } from 'src/user/user.service'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_ACCESS_SECRET
    })
  }

  async validate(payload: JwtPayload, done: VerifiedCallback): Promise<void> {
    const user = await this.userService.findOneById(payload.userId)
    if (!user) {
      return done(new UnauthorizedException(), false)
    }
    done(null, user)
  }
}
