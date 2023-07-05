import { Request } from 'express'
import { UserEntity } from '../user/user-dto'

interface RequestWithUser extends Request {
  user: UserEntity
}

export default RequestWithUser
