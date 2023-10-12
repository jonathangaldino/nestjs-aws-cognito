import { IsNotEmpty, IsString, Max, Min } from 'class-validator';

export class SignupDTO {
  @IsString()
  @IsNotEmpty()
  @Min(0)
  @Max(255)
  email: string;

  @Min(8)
  @Max(24)
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class SigninDTO {
  @IsString()
  @IsNotEmpty()
  @Min(0)
  @Max(255)
  email: string;

  @Min(8)
  @Max(24)
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class ConfirmSignupDTO {
  @IsString()
  @IsNotEmpty()
  @Min(0)
  @Max(255)
  email: string;

  @Min(0)
  @Max(10)
  @IsString()
  @IsNotEmpty()
  confirmationCode: string;
}

export class RefreshIdentityTokenDTO {
  @IsString()
  @IsNotEmpty()
  @Min(0)
  refreshToken: string;

  @IsString()
  @IsNotEmpty()
  @Min(0)
  @Max(255)
  userId: string;
}
