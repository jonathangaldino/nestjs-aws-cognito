import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class CognitoGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>();

    const authHeader = request.headers['authorization'];

    if (!authHeader) {
      throw new UnauthorizedException();
    }

    const [, token] = authHeader.split(' ');

    if (!token) {
      throw new UnauthorizedException();
    }

    const isAuthorized = await this.authService.verifyToken(token);

    if (!isAuthorized) {
      throw new UnauthorizedException();
    }

    await this.authService.getUserData(token);

    const user = {
      username: isAuthorized.username,
    };

    request['user'] = user;

    return Promise.resolve(true);
  }
}
