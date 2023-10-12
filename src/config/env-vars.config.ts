import * as Joi from 'joi';

export interface EnvironmentVariables {
  AWS_SECRET_ACCESS_KEY: string;
  AWS_ACCESS_KEY_ID: string;
  AWS_COGNITO_USER_POOL_ID: string;
  AWS_COGNITO_APP_CLIENT_ID: string;
  AWS_COGNITO_APP_CLIENT_SECRET: string;
}

export const validationSchemaForEnv = Joi.object<EnvironmentVariables, true>({
  AWS_SECRET_ACCESS_KEY: Joi.string().required(),
  AWS_ACCESS_KEY_ID: Joi.string().required(),
  AWS_COGNITO_USER_POOL_ID: Joi.string().required(),
  AWS_COGNITO_APP_CLIENT_ID: Joi.string().required(),
  AWS_COGNITO_APP_CLIENT_SECRET: Joi.string().required(),
});
