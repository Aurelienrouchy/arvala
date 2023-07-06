import { Controller, Get, Post, UseGuards, Req, Body } from '@nestjs/common'
import { User } from 'src/user/user.schema'
import { AuthService } from './auth.service'
import JwtAuthenticationGuard from './jwt-authentication.guard'
import RequestWithUser from './requestWithUser.interface'
import { UserEntity } from '../user/user.dto'

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService // private readonly userService: UserService,
  ) {}

  @Post('google')
  async googleAuth(
    @Body('token') token: string
  ): Promise<{ user: UserEntity; accessToken: string; refreshToken: string }> {
    return await this.authService.googleAuth(token)
  }

  @Get('login')
  @UseGuards(JwtAuthenticationGuard)
  async login(@Req() request: RequestWithUser): Promise<UserEntity> {
    return request.user
  }

  // @UseGuards(AuthGuard('refresh-jwt'))
  // @Post('refresh')
  // async refresh(@Request() req): Promise<{ accessToken: string }> {
  //   return { accessToken: this.authService.createAccessToken(req.user) }
  // }

  // @UseGuards(AuthGuard('jwt'))
  // @Post('logout')
  // async logout(@Request() req): Promise<void> {
  //   await this.authService.revokeRefreshToken(
  //     req.headers.authorization.split(' ')[1]
  //   )
  // }
}
