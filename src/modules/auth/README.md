# Authentication Module

This module authenticates with AWS Cognito.

## Cognito Core Conceps

AWS has two concepts:

- User Pools
- Identity Pools

### User Pools

Manage a pool of users, where you can have one or many application that can interact with that pool of users.

App -> authenticate and get tokens -> User Pool -> (Social Signin - google/apple/amazon, OIDC/SAML).

You can use AWS Cognito as Identity Provider OR use any of these social sign on as identity providers.

When you ask your user to provide an username, email and password, the authentication happens with Cognito being the identity provider.

You can also integrate other social sign on with the user pool - and then get a record of the user on your system (cognito).

When you create a User Pool, you define the required attributes to ask the user to provide when they need to signup. 
You can ask for:
- email
- password
- age
- others

There are some core properties like email and username, **but you can create custom attributes**. For some fields, you can even choose the level of validation. 

E.g.: password fields should have a minimum length of 8 and should follow the policy of having uppercase letters, lowercase letters, special characters, numbers, etc.

You can enable MFA or e-mail the code to the user.


### Identity Pools

They are useful to provide short term access to AWS services (dynamodb, s3, others).

WebApp/Device -> Login Provider (social or email) -> Cognito -> AWS STS (IAM role) with access to AWS services.


### Tying these two together

You can have users being signup to the pool and tag them with attributes and when the user is authenticated in the identity pool you can read these attributes and decide which roles to use and therefore the level of access to give.
