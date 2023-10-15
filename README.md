# Node AWS Cognito

Sample app where I add authentication with AWS Cognito to a NestJS app.

I'm using this learning project to write posts at my [blog](https://blog.galdino.dev).

- [The basics of integrating your backend with AWS Cognito](https://blog.galdino.dev/the-basics-of-integrating-your-backend-with-aws-cognito)
- [Authentication Guard in NestJS with AWS Cognito](https://blog.galdino.dev/authentication-guard-in-nestjs-with-aws-cognito)

## Requests with Httpie

### Signup

Please, sign up with a valid email to receive a confirmation code in your inbox.
I'm using [Temp Email](https://temp-mail.org/) to generate random email accounts for me.

```bash
$ http POST localhost:3000/auth/signup email=ceyicef794@dixiser.com password=Strong123#
```
### Confirm account


```bash
$ http POST http://localhost:3000/auth/signup/confirm email=ceyicef794@dixiser.com confirmationCode=000000
```
### Signin

```bash
$ http POST http://localhost:3000/auth/signin email=ceyicef794@dixiser.com password=Strong123#
```

### Refresh Token

```bash
$ http POST http://localhost:3000/auth/refresh refreshToken="<refresh token here>" userId="<userId here>"
```

## The authenticated route

The HOME controller has one GET route **/home** there is a protected route. 

To access it, you must add the bearer token to the header.

```json
{
  authorization: Bearer <token>
}

```

Httpie:

```bash
$ http GET http://localhost:3000/home -A bearer -a "<token>"
```
