import {
  Controller,
  Get,
  Post,
  UseGuards,
  Req,
  Body,
  UseFilters
} from '@nestjs/common'
import { User } from 'src/user/user.schema'
import { AuthService } from './auth.service'
import JwtAuthenticationGuard from './jwt-authentication.guard'
import RequestWithUser from './requestWithUser.interface'
import { UserEntity } from '../user/user.dto'
import { TokenVerificationDto } from './auth.dto'
import { AppleOAuthGuard } from './strategies/apple.strategy'

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService // private readonly userService: UserService,
  ) {}

  @Post('google')
  async googleAuth(@Body() body: { token: string }) {
    return this.authService.googleAuth(body.token)
  }

  @Post('apple')
  @UseGuards(AppleOAuthGuard)
  async appleLogin(@Body() body: { token: string }) {
    try {
      return await this.authService.appleAuth(body.token)
    } catch (error) {
      console.log(error)
    }
  }

  @Post('apple/callback')
  @UseGuards(AppleOAuthGuard)
  async appleCallback(@Req() req) {
    console.log('coucou')
    return req.user
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
