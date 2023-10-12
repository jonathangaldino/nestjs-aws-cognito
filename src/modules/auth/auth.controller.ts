import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import {
  ConfirmSignupDTO,
  RefreshIdentityTokenDTO,
  SigninDTO,
  SignupDTO,
} from './dto/signup.dto';

@Controller('/auth')
export class AuthController {
  constructor(private service: AuthService) {}

  @Post('/signup')
  async signup(@Body() dto: SignupDTO, @Res() res: Response) {
    await this.service.signup(dto);

    return res
      .status(HttpStatus.OK)
      .json({ message: 'Registered. Pending confirmation.' });
  }

  @Post('/signup/confirm')
  async confirmAccount(@Body() dto: ConfirmSignupDTO, @Res() res: Response) {
    await this.service.confirm(dto);

    return res.status(HttpStatus.OK).json({ message: 'Account confirmed' });
  }

  @Post('/signin')
  async signin(@Body() dto: SigninDTO, @Res() res: Response) {
    await this.service.signin(dto);

    return res.status(HttpStatus.OK).json({ message: 'Signed in' });
  }

  @Post('/refresh')
  async refreshIdentityToken(
    @Body() dto: RefreshIdentityTokenDTO,
    @Res() res: Response,
  ) {
    await this.service.refreshIdentityToken(dto);

    return res
      .status(HttpStatus.OK)
      .json({ message: 'Succeded in refreshing identity token' });
  }
}
