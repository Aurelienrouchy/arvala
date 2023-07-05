import { IsDefined, IsEmail, IsString } from 'class-validator'
import { AbstractEntity } from 'src/utils/BaseDBObject'
import { GeoPoint } from 'src/utils/GeoPoint'

export class UserDto extends AbstractEntity {
  @IsString()
  name: string

  @IsString()
  @IsEmail()
  email: string

  @IsDefined()
  location: GeoPoint
}

export class CreateGoogleUserDto extends UserDto {
  @IsString()
  providerId: string

  @IsString()
  providerName: string

  @IsString()
  picture: string
}

export class CreateEmailUserDto extends UserDto {
  @IsString()
  password: string
}
