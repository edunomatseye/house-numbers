import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db"; // your drizzle instance

export const auth = betterAuth({
  baseURL: "http://localhost:52344",
  trustedOrigins: ["http://localhost:3031", "http://localhost:3030"],
  database: drizzleAdapter(db, {
    provider: "pg", // or "mysql", "sqlite"
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    async sendResetPassword(data, request) {
      // Send an email to the user with a link to reset their password
      console.log("Sending email url link: ", data.url);
      console.log("Sending user token to: ", data.token);
      console.log("Sending user details to: ", data.user);
    },
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
      redirectUri: "https://localhost:3031/api/auth/callback/github",
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      redirectUri: "https://localhost:3031/api/auth/callback/google",
    },
  },
});
