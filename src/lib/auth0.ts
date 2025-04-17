export const auth0 = {
  getSession: async () => {
    // This will be handled by the Auth0 SDK
    return null;
  },
  handleCallback: async () => {
    return `${process.env.APP_BASE_URL}/dashboard`;
  },
  login: async () => {
    const auth0Domain = process.env.AUTH0_DOMAIN?.replace("https://", "");
    const clientId = process.env.AUTH0_CLIENT_ID;
    const redirectUri = `${process.env.APP_BASE_URL}/api/auth/callback`;
    const scope = process.env.AUTH0_SCOPE || "openid profile email";

    return (
      `https://${auth0Domain}/authorize?` +
      `response_type=code&` +
      `client_id=${clientId}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `scope=${encodeURIComponent(scope)}`
    );
  },
};
