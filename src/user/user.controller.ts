import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards
} from '@nestjs/common'
import { UserService } from './user.service'
import { User } from './user.schema'
import { CreateGoogleUserDto } from './create-user.dto'
import RequestWithUser from 'src/auth/requestWithUser.interface'
import JwtAuthenticationGuard from 'src/auth/jwt-authentication.guard'
import { BodyWithLocation } from './type'
import { UserEntity } from './user-dto'

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get(':id')
  findOneById(@Param('id') id: string): Promise<UserEntity> {
    return this.userService.findOneById(id)
  }

  @Post()
  create(@Body() user: CreateGoogleUserDto): Promise<UserEntity> {
    return this.userService.create(user)
  }

  @Post('update-location')
  @UseGuards(JwtAuthenticationGuard)
  updateLocation(
    @Body() body: BodyWithLocation,
    @Req() request: RequestWithUser
  ): Promise<User> {
    return this.userService.updateLocation(request.user.id, body.location)
  }

  @Put()
  @UseGuards(JwtAuthenticationGuard)
  update(
    @Body() user: Partial<User>,
    @Req() request: RequestWithUser
  ): Promise<UserEntity> {
    return this.userService.updateOneById(request.user.id, user)
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<UserEntity> {
    return this.userService.deleteOneById(id)
  }

  @Delete('follow/:id')
  follow(@Param('id') id: string): Promise<UserEntity> {
    return this.userService.deleteOneById(id)
  }

  @Delete('unfollow/:id')
  unFollow(@Param('id') id: string): Promise<UserEntity> {
    return this.userService.deleteOneById(id)
  }
}
