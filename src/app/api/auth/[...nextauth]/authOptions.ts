import {type NextAuthOptions} from "next-auth";

// Providers
import CredentialsProvider from "next-auth/providers/credentials"
import GitHubProvider from "next-auth/providers/github";

// functions
import { accountExists } from "../../../../lib/accountExists"
import { createAccount } from "@/lib/createAccount";
import { updateActivity } from "@/lib/updateActivity";

export const authOptions: NextAuthOptions = {
  secret: process.env.AUTH_SECRET,
  providers: [
        CredentialsProvider({
          // The name to display on the sign in form (e.g. 'Sign in with...')
          name: 'Sign in with Username/Password',

          // The credentials is used to generate a suitable form on the sign in page.
          // You can specify whatever fields you are expecting to be submitted.
          // e.g. domain, username, password, 2FA token, etc.
          // You can pass any HTML attribute to the <input> tag through the object.
          credentials: {
            username: { label: "Username", type: "text", placeholder: "John Doe" },
            password: { label: "Password", type: "password" }
          },

          async authorize(credentials, req) {
            // You need to provide your own logic here that takes the credentials
            // submitted and returns either a object representing a user or value
            // that is false/null if the credentials are invalid.
            // e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
            // You can also use the `req` object to obtain additional parameters
            // (i.e., the request IP address)
            const res = await fetch(`${process.env.NEXTAUTH_URL}/api/accounts/credentials`, {
              method: 'POST',
              body: JSON.stringify(credentials),
              headers: { "Content-Type": "application/json" }
            })
            const user = await res.json()

            const response = await fetch(`${process.env.NEXTAUTH_URL}/api/accounts/get?username=${credentials?.username}`);
            const json = await response.json();
            const userID = json['id'];

            const userObj = {
              email: credentials?.username,
              name: userID
            }
      
            // If no error and we have user data, return it
            if (res.ok && user) {
              return userObj;
            }
            // Return null if user data could not be retrieved
            return null
          }
        }),
        GitHubProvider({
          id: "github",
          clientId: process.env.GITHUB_ID!,
          clientSecret: process.env.GITHUB_SECRET!
        })
      ],
      callbacks: {
        async signIn({ user, account, profile, email, credentials }) {
          let type: string;
          let provider: string;
          let externalID: number;
          let username: string;

          if (account?.type == 'oauth') {
            type = "sso";
            provider = account?.provider;
            externalID = Number(account?.providerAccountId);
            username = profile?.login;

            const response = await accountExists(type, provider, externalID);

            if (!response) {
              const account = await createAccount("sso", username, null, provider, externalID);
            }

            updateActivity(username);
          } else {
            const username: string | null = credentials?.username;

            if (username === null) {
              return;
            }

            const response = await accountExists("credentials", username, null);

            if (!response) {
              const account = createAccount("credentials", username, credentials?.password, null, null);
            }

            updateActivity(username)
          }

          return true;
        }
      }
};