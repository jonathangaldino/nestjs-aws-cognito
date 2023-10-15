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
    const { error, data } = await this.service.signup(dto);

    if (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        error,
      });
    } else {
      return res.status(HttpStatus.CREATED).json(data);
    }
  }

  @Post('/signup/confirm')
  async confirmAccount(@Body() dto: ConfirmSignupDTO, @Res() res: Response) {
    const { error } = await this.service.confirm(dto);

    if (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        error,
      });
    } else {
      return res.status(HttpStatus.NO_CONTENT).send();
    }
  }

  @Post('/signin')
  async signin(@Body() dto: SigninDTO, @Res() res: Response) {
    const { error, data } = await this.service.signin(dto);

    if (error) {
      return res.status(HttpStatus.UNAUTHORIZED).json({ error });
    }

    return res.status(HttpStatus.CREATED).json(data);
  }

  @Post('/refresh')
  async refreshIdentityToken(
    @Body() dto: RefreshIdentityTokenDTO,
    @Res() res: Response,
  ) {
    const { error, data } = await this.service.refreshIdentityToken(dto);

    if (error) {
      return res.status(HttpStatus.UNAUTHORIZED).json({ error });
    }

    return res.status(HttpStatus.CREATED).json(data);
  }
}
