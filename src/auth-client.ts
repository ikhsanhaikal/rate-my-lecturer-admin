import { Auth0Client } from "@auth0/auth0-spa-js";

const client = new Auth0Client({
  domain: import.meta.env.VITE_AUTH0_DOMAIN,
  clientId: import.meta.env.VITE_AUTH0_CLIENT_ID,
  authorizationParams: {
    audience: import.meta.env.VITE_AUTH0_AUDIENCE,
    scope: "openid profile email",
    redirect_uri: import.meta.env.VITE_LOGIN_REDIRECT_URL,
  },
  useRefreshTokens: true,
  cacheLocation: "localstorage",
});

export default client;
