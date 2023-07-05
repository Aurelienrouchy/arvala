import { IsNumber } from 'class-validator'

export interface JwtPayloadInterface {
  userId: number
}

export class JwtPayload {
  @IsNumber()
  userId: string
}
