import { Module } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { HomeController } from './home.controller';

@Module({
  controllers: [HomeController],
  providers: [AuthService],
})
export class HomeModule {}
