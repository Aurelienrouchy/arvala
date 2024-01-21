import {
  Controller,
  Get,
  Post,
  UseGuards,
  Req,
  Body,
  UseFilters,
  Query,
  Delete,
  Param
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
  async googleAuth(
    @Body() body: { token: string; name: string; age: string; gender: string }
  ): Promise<{ user: UserEntity; accessToken: string; refreshToken: string }> {
    return this.authService.googleAuth({
      token: body.token,
      name: body.name,
      age: body.age,
      gender: body.gender
    })
  }

  @Get('google')
  async getUserWithToken(
    @Query('token') token: string
  ): Promise<{ user: UserEntity; accessToken: string; refreshToken: string }> {
    return this.authService.getUserWithToken(token)
  }

  @Get('login')
  @UseGuards(JwtAuthenticationGuard)
  async login(@Req() request: RequestWithUser): Promise<UserEntity> {
    return request.user
  }

  @Delete(':id')
  deleteEvent(@Param('id') id: string) {
    return this.authService.deleteOneById(id)
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
