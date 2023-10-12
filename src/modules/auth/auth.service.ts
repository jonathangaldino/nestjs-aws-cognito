import {
  CognitoIdentityProvider,
  ConfirmSignUpCommandInput,
  InitiateAuthCommandInput,
  SignUpCommandInput,
} from '@aws-sdk/client-cognito-identity-provider';
import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
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

    const data = await this.identityProvider.signUp(params);

    console.log({ data });
  }

  async confirm({ confirmationCode, email }: ConfirmSignupDTO) {
    const params: ConfirmSignUpCommandInput = {
      ClientId: this.clientId,
      ConfirmationCode: confirmationCode,
      Username: email,
      SecretHash: this.#generateHash(email),
    };

    const data = await this.identityProvider.confirmSignUp(params);

    console.log(data);
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

    const data = await this.identityProvider.initiateAuth(params);
    console.log({ data });
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
        SECRET_HASH: this.#generateHash('ceyicef794@dixiser.com'),
      },
    };

    const data = await this.identityProvider.initiateAuth(params);

    console.log(data);
  }

  #generateHash(username: string) {
    return crypto
      .createHmac('SHA256', this.secretKey)
      .update(username + this.clientId)
      .digest('base64');
  }
}
