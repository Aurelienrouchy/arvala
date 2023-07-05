// import { Injectable } from '@nestjs/common'
// import { JwtService } from '@nestjs/jwt'
// import { ConfigService } from '@nestjs/config'
// import VerificationTokenPayload from './verificationTokenPayload.interface'
// import EmailService from '../email/email.service'
// import { UsersService } from '../users/users.service'

// @Injectable()
// export class EmailConfirmationService {
//   constructor(
//     private readonly jwtService: JwtService,
//     private readonly configService: ConfigService,
//     private readonly emailService: EmailService
//   ) {}

//   public sendVerificationLink(email: string) {
//     const payload: VerificationTokenPayload = { email }
//     const token = this.jwtService.sign(payload, {
//       secret: this.configService.get('JWT_VERIFICATION_TOKEN_SECRET'),
//       expiresIn: `${this.configService.get(
//         'JWT_VERIFICATION_TOKEN_EXPIRATION_TIME'
//       )}s`
//     })

//     const url = `${this.configService.get(
//       'EMAIL_CONFIRMATION_URL'
//     )}?token=${token}`

//     const text = `Welcome to the application. To confirm the email address, click here: ${url}`

//     return this.emailService.sendMail({
//       to: email,
//       subject: 'Email confirmation',
//       text
//     })
//   }
// }
