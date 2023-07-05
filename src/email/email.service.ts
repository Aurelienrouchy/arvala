// import { Injectable } from '@nestjs/common'
// import { createTransport } from 'nodemailer'
// import * as Mail from 'nodemailer/lib/mailer'
// import { ConfigService } from '@nestjs/config'

// @Injectable()
// export default class EmailService {
//   private nodemailerTransport: Mail

//   constructor(private readonly configService: ConfigService) {
//     this.nodemailerTransport = createTransport({
//       service: process.env.EMAIL_SERVICE,
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASSWORD
//       }
//     })
//   }

//   sendMail(options: Mail.Options) {
//     return this.nodemailerTransport.sendMail(options)
//   }
// }
