// BetterAuth configuration placeholder
// This file is kept as a reference for BetterAuth setup
// The actual auth is handled via AuthContext with localStorage + JWT cookies

export const authConfig = {
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
};
