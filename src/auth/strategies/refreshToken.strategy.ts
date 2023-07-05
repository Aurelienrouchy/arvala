// import { ExtractJwt, Strategy, VerifiedCallback } from 'passport-jwt'
// import { PassportStrategy } from '@nestjs/passport'
// import { Injectable } from '@nestjs/common'
// import { AuthService } from '../auth.service'
// import { JwtPayload } from './jwt-payload.interface'
// import { UserService } from 'src/user/user.service'

// @Injectable()
// export class JwtRefreshTokenStrategy extends PassportStrategy(
//   Strategy,
//   'jwt-refresh-token'
// ) {
//   constructor(
//     private readonly authService: AuthService,
//     private readonly userService: UserService
//   ) {
//     super({
//       jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//       secretOrKey: process.env.JWT_REFRESH_SECRET,
//       passReqToCallback: true
//     })
//   }

//   async validate(payload: JwtPayload, done: VerifiedCallback) {
//     // const token = payload.userId

//     // const userId = this.authService.findUserIdWithRefreshToken(token)

//     // if (!user) {
//     //   return done(new UnauthorizedException(), false)
//     // }
//     // done(null, user)
//     // done()
//   }
// }
