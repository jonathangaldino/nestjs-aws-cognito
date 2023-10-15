import {
  CognitoIdentityProvider,
  ConfirmSignUpCommandInput,
  GetUserCommandInput,
  InitiateAuthCommandInput,
  SignUpCommandInput,
} from '@aws-sdk/client-cognito-identity-provider';
import { Injectable } from '@nestjs/common';
import { CognitoJwtVerifier } from 'aws-jwt-verify';
import * as crypto from 'crypto';

import { toErrorWithMessage } from '../error-handler';
import {
  ConfirmSignupDTO,
  RefreshIdentityTokenDTO,
  SigninDTO,
  SignupDTO,
} from './dto/signup.dto';

@Injectable()
export class AuthService {
  private identityProvider: CognitoIdentityProvider;
  private clientId = process.env.AWS_COGNITO_APP_CLIENT_ID;
  private clientSecret = process.env.AWS_COGNITO_APP_CLIENT_SECRET;
  private userPoolId = process.env.AWS_COGNITO_USER_POOL_ID;
  private secretKey: crypto.KeyObject;

  constructor() {
    this.identityProvider = new CognitoIdentityProvider({
      region: 'us-east-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });

    this.secretKey = crypto.createSecretKey(this.clientSecret, 'utf8');
  }

  async signup({ email, password }: SignupDTO) {
    const hash = this.#generateHash(email);

    const params: SignUpCommandInput = {
      ClientId: this.clientId,
      SecretHash: hash,
      Username: email,
      Password: password,
      UserAttributes: [
        {
          Name: 'email',
          Value: email,
        },
      ],
    };

    try {
      const data = await this.identityProvider.signUp(params);

      return {
        data: {
          userId: data.UserSub,
          isPendingConfirmation: !data.UserConfirmed,
        },
        error: null,
      };
    } catch (err) {
      const message = toErrorWithMessage(err);

      return { error: message, data: null };
    }
  }

  async confirm({ confirmationCode, email }: ConfirmSignupDTO) {
    const params: ConfirmSignUpCommandInput = {
      ClientId: this.clientId,
      ConfirmationCode: confirmationCode,
      Username: email,
      SecretHash: this.#generateHash(email),
    };

    try {
      await this.identityProvider.confirmSignUp(params);

      return { data: {}, error: null };
    } catch (err) {
      const message = toErrorWithMessage(err);

      return { error: message, data: null };
    }
  }

  async signin({ email, password }: SigninDTO) {
    const params: InitiateAuthCommandInput = {
      AuthFlow: 'USER_PASSWORD_AUTH',
      ClientId: this.clientId,
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password,
        SECRET_HASH: this.#generateHash(email),
      },
    };

    try {
      const data = await this.identityProvider.initiateAuth(params);
      return {
        error: null,
        data: {
          token: data.AuthenticationResult.AccessToken,
          tokenType: data.AuthenticationResult.TokenType,
          idToken: data.AuthenticationResult.IdToken,
          refreshToken: data.AuthenticationResult.RefreshToken,
          expiresIn: data.AuthenticationResult.AccessToken,
        },
      };
    } catch (err) {
      const message = toErrorWithMessage(err);

      return { error: message, data: null };
    }
  }

  async refreshIdentityToken({
    refreshToken,
    userId,
  }: RefreshIdentityTokenDTO) {
    const params: InitiateAuthCommandInput = {
      ClientId: this.clientId,
      AuthFlow: 'REFRESH_TOKEN_AUTH',
      AuthParameters: {
        REFRESH_TOKEN: refreshToken,
        SECRET_HASH: this.#generateHash(userId),
      },
    };

    try {
      const data = await this.identityProvider.initiateAuth(params);

      return {
        error: null,
        data: {
          token: data.AuthenticationResult.AccessToken,
          tokenType: data.AuthenticationResult.TokenType,
          idToken: data.AuthenticationResult.IdToken,
          refreshToken: data.AuthenticationResult.RefreshToken,
          expiresIn: data.AuthenticationResult.AccessToken,
        },
      };
    } catch (err) {
      const message = toErrorWithMessage(err);

      return { error: message, data: null };
    }
  }

  async verifyToken(token: string): Promise<{ username: string } | null> {
    const verifier = CognitoJwtVerifier.create({
      userPoolId: this.userPoolId,
      tokenUse: 'access',
      clientId: this.clientId,
    });

    try {
      const payload = await verifier.verify(token);
      return { username: payload.username };
    } catch {
      return null;
    }
  }

  async getUserData(accessToken: string) {
    const params: GetUserCommandInput = {
      AccessToken: accessToken,
    };

    try {
      const response = await this.identityProvider.getUser(params);

      return {
        error: null,
        data: {
          userId: response.Username,
          attributes: response.UserAttributes,
        },
      };
    } catch (err) {
      const message = toErrorWithMessage(err);

      return { error: message, data: null };
    }
  }

  #generateHash(username: string) {
    return crypto
      .createHmac('SHA256', this.secretKey)
      .update(username + this.clientId)
      .digest('base64');
  }
}
