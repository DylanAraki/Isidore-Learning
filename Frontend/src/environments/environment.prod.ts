import { COGNITO_USER_POOL_ID, COGNITO_WEB_CLIENT_ID } from './hidden'
export const environment = {
  production: true,
  cognito: {
    userPoolId: COGNITO_USER_POOL_ID,
    userPoolWebClientId: COGNITO_WEB_CLIENT_ID
  }
};
