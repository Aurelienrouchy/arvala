// // import { Injectable } from '@nestjs/common'
// // import { createTransport } from 'nodemailer'
// // import * as Mail from 'nodemailer/lib/mailer'
// // import { ConfigService } from '@nestjs/config'

// // @Injectable()
// // export default class EmailService {
// //   private nodemailerTransport: Mail

// //   constructor(private readonly configService: ConfigService) {
// //     this.nodemailerTransport = createTransport({
// //       service: process.env.EMAIL_SERVICE,
// //       auth: {
// //         user: process.env.EMAIL_USER,
// //         pass: process.env.EMAIL_PASSWORD
// //       }
// //     })
// //   }

// //   sendMail(options: Mail.Options) {
// //     return this.nodemailerTransport.sendMail(options)
// //   }
// // }

// Sure, I can help you with that. Here is a sample implementation of a controller, service, entity, and DTO for email authentication using **NestJS**:

// ```typescript
// // auth.controller.ts
// import { Controller, Post, Body } from '@nestjs/common';
// import { AuthService } from './auth.service';
// import { LoginDto } from './dto/login.dto';
// import { RegisterDto } from './dto/register.dto';
// import { ForgotPasswordDto } from './dto/forgot-password.dto';
// import { ResetPasswordDto } from './dto/reset-password.dto';
// import { ChangePasswordDto } from './dto/change-password.dto';
// import { VerifyEmailDto } from './dto/verify-email.dto';
// import { ResendVerificationEmailDto } from './dto/resend-verification-email.dto';
// import { LogoutDto } from './dto/logout.dto';
// import { RefreshTokenDto } from './dto/refresh-token.dto';
// import { User } from './entities/user.entity';
// import * as bcrypt from 'bcrypt';

// @Controller('auth')
// export class AuthController {
//   constructor(private readonly authService: AuthService) {}

//   @Post('login')
//   async login(@Body() loginDto: LoginDto) {
//     return this.authService.login(loginDto);
//   }

//   @Post('register')
//   async register(@Body() registerDto: RegisterDto) {
//     return this.authService.register(registerDto);
//   }

//   @Post('forgot-password')
//   async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
//     return this.authService.forgotPassword(forgotPasswordDto);
//   }

//   @Post('reset-password')
//   async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
//     return this.authService.resetPassword(resetPasswordDto);
//   }

//   @Post('change-password')
//   async changePassword(@Body() changePasswordDto: ChangePasswordDto) {
//     return this.authService.changePassword(changePasswordDto);
//   }

//   @Post('verify-email')
//   async verifyEmail(@Body() verifyEmailDto: VerifyEmailDto) {
//     return this.authService.verifyEmail(verifyEmailDto);
//   }

//   @Post('resend-verification-email')
//   async resendVerificationEmail(@Body() resendVerificationEmailDto: ResendVerificationEmailDto) {
//     return this.authService.resendVerificationEmail(resendVerificationEmailDto);
//   }

//   @Post('logout')
//   async logout(@Body() logoutDto: LogoutDto) {
//     return this.authService.logout(logoutDto);
//   }

//   @Post('refresh-token')
//   async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
//     return this.authService.refreshToken(refreshTokenDto);
//   }
// }

// // auth.service.ts
// // import { Injectable } from '@nestjs/common';
// import { JwtService } from '@nestjs/jwt';
// import { LoginDto } from './dto/login.dto';
// import { RegisterDto } from './dto/register.dto';
// import { ForgotPasswordDto } from './dto/forgot-password.dto';
// import { ResetPasswordDto } from './dto/reset-password.dto';
// import { ChangePasswordDto } from './dto/change-password.dto';
// import { VerifyEmailDto } from './dto/verify-email.dto';
// import { ResendVerificationEmailDto } from './dto/resend-verification-email.dto';
// import { LogoutDto } from './dto/logout.dto';
// import { RefreshTokenDto } from './dto/refresh-token.dto';
// import { User } from './entities/user.entity';
// import * as bcrypt from 'bcrypt';

// @Injectable()
// export class AuthService {
//   constructor(private readonly jwtService: JwtService) {}

//   async login(loginDto: LoginDto): Promise<{ access_token: string }> {
//     const user = await User.findOne({ email: loginDto.email });

//     if (!user) {
//       throw new Error('User not found');
//     }

//     const isMatch = await bcrypt.compare(loginDto.password, user.password);

//     if (!isMatch) {
//       throw new Error('Invalid credentials');
//     }

//     const payload = { email: user.email };
//     const access_token = this.jwtService.sign(payload);

//     return { access_token };
//   }

//   async register(registerDto: RegisterDto): Promise<{ message: string }> {
//     const user = await User.findOne({ email: registerDto.email });

//     if (user) {
//       throw new Error('User already exists');
//     }

//     const newUser = new User();
//     newUser.email = registerDto.email;
//     newUser.password = await bcrypt.hash(registerDto.password, 10);

//     await newUser.save();

//     return { message: 'User registered successfully' };
//   }

//   async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<{ message: string }> {
//     const user = await User.findOne({ email: forgotPasswordDto.email });

//     if (!user) {
//       throw new Error('User not found');
//     }

//     // Send password reset email to user
//     return { message: 'Password reset email sent successfully' };
//   }

//   async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<{ message: string }> {
//     const user = await User.findOne({ email: resetPasswordDto.email

// Source: Conversation with Bing, 25/12/2023
// (1) Authentication | NestJS - A progressive Node.js framework. https://docs.nestjs.com/security/authentication.
// (2) Building authentication for microservices using NestJS. https://dev.to/alesanchez/building-authentication-for-microservices-using-nestjs-1fne.
// (3) NestJS Authentication with OAuth2.0: Fastify Local OAuth REST API. https://dev.to/tugascript/nestjs-authentication-with-oauth20-fastify-local-oauth-5gn9.
// (4) NestJs: Firebase Auth secured NestJs app | by Vikash Kumar - Medium. https://medium.com/nerd-for-tech/nestjs-firebase-auth-secured-nestjs-resource-server-9649bcebd0de.
// (5) GitHub - marcomelilli/nestjs-email-authentication: Nestjs Starter using .... https://github.com/marcomelilli/nestjs-email-authentication.
// (6) How to Create a NestJS App with Authentication - Medium. https://levelup.gitconnected.com/how-to-create-a-nestjs-app-with-authentication-c0ae845ff6ac.
// (7) NestJS Code Sample: Basic API Authorization - Auth0 Developer Resources. https://developer.auth0.com/resources/code-samples/api/nestjs/basic-authorization.
// (8) How to build authorization service with NestJS? - Stack Overflow. https://stackoverflow.com/questions/69136346/how-to-build-authorization-service-with-nestjs.
// (9) How to implement JWT authentication in NestJS - LogRocket Blog. https://blog.logrocket.com/how-to-implement-jwt-authentication-nestjs/.
// (10) github.com. https://github.com/ZvonimirSun/iszy-api/tree/aa97aec3306967963da7aa4a0a5dd31ca638d5d5/src%2Fmodules%2Fauth%2Fauth.controller.ts.
