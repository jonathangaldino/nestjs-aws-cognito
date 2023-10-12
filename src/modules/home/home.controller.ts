import { Controller, Get, HttpStatus, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { CognitoGuard } from '../auth/guards/cognito.guard';

@UseGuards(CognitoGuard)
@Controller('home')
export class HomeController {
  @Get()
  home(@Res() res: Response) {
    return res.status(HttpStatus.OK).json({ message: 'All good!' });
  }
}
