/** Google OAuth2 client configuration read from environment variables. */
export interface OAuthConfig {
  clientId: string;
  clientSecret: string;
  refreshToken: string;
  redirectBaseUrl: string;
  stateSecret: string;
}
