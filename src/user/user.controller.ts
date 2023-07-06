import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards
} from '@nestjs/common'
import { UserService } from './user.service'
import { User } from './user.schema'
import RequestWithUser from 'src/auth/requestWithUser.interface'
import JwtAuthenticationGuard from 'src/auth/jwt-authentication.guard'
import { UserEntity } from './user.dto'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get(':id')
  findOneById(@Param('id') id: string): Promise<UserEntity> {
    return this.userService.findOneById(id)
  }

  @Get()
  findByFilters(@Body() user: Partial<UserEntity>): Promise<UserEntity[]> {
    return this.userService.findByFilters(user)
  }

  @Get()
  findAll(): Promise<UserEntity[]> {
    return this.userService.findAll()
  }

  @Post()
  create(@Body() user): Promise<UserEntity> {
    return this.userService.create(user)
  }

  // @Post('update-location')
  // @UseGuards(JwtAuthenticationGuard)
  // updateLocation(
  //   @Body() body: BodyWithLocation,
  //   @Req() request: RequestWithUser
  // ): Promise<User> {
  //   return this.userService.updateLocation(request.user.id, body.location)
  // }

  @Put(':id')
  // @UseGuards(JwtAuthenticationGuard)
  update(
    @Param('id') id: string,
    @Body() user: Partial<User>
    // @Req() request: RequestWithUser
  ): Promise<UserEntity> {
    return this.userService.updateOneById(id, user)
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
