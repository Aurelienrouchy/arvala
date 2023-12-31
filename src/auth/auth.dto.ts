import { IsString, IsNotEmpty, IsNumber } from 'class-validator'

export class TokenVerificationDto {
  @IsString()
  @IsNotEmpty()
  token: string

  @IsNumber()
  @IsNotEmpty()
  lat: number

  @IsNumber()
  @IsNotEmpty()
  lng: number
}
