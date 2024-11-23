
import {type NextAuthOptions} from "next-auth";

// Providers
import CredentialsProvider from "next-auth/providers/credentials"
import GitHubProvider from "next-auth/providers/github";

// functions
import { accountExists } from "../../../../lib/accountExists"

export const authOptions: NextAuthOptions = {
  secret: process.env.AUTH_SECRET,
  providers: [
    /*
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
            const res = await fetch("/api/accounts/create", {
              method: 'POST',
              body: JSON.stringify(credentials),
              headers: { "Content-Type": "application/json" }
            })
            const user = await res.json()
      
            // If no error and we have user data, return it
            if (res.ok && user) {
              return user
            }
            // Return null if user data could not be retrieved
            return null
          }
        }),
        */
        GitHubProvider({
          id: "github",
          clientId: process.env.GITHUB_ID!,
          clientSecret: process.env.GITHUB_SECRET!
        })
      ],
      callbacks: {
        async signIn({ user, account, profile, email, credentials }) {
          /*
          const response = await fetch("http://localhost:3001/api/accounts/exists", {
            method: 'POST',
            body: JSON.stringify(credentials),
            headers: { "Content-Type": "application/json" }
          })

          //response.json().then(data => console.log(data));
          */

          /*
          console.log(user)
          console.log()
          console.log(account)
          console.log()
          console.log(profile)
          */

          let type: string;
          let provider: string;
          let externalID: Number;

          if (account?.type == 'oauth') {
            type = "sso";
            provider = account?.provider;
            externalID = Number(account?.providerAccountId);
          } else {
            type = "credentials";
            provider = "username"; // fix this
            externalID = -1;
          }

          const response = accountExists(type, provider, externalID)

          return true;
        },
        session: async ({ session, user, token }) => {
          // Read EXTERNAL ID with `user.token.sub` or `user.token.sub`
          return session;
       },
      }
}