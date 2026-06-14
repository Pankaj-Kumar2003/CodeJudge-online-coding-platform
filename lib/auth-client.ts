import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  // Uses localhost during local development
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
});

// Export hooks so you can easily import them in your login forms or navigation bar
export const { useSession, signIn, signUp, signOut } = authClient;
