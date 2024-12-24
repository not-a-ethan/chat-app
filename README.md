# Chat app

Chat app with a similer concept to discord. Still a WIP and has many un-finshed features

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Also make sure you make the db. The docs for the db layout is located at '/src/app/database/DB docs.md'

___

Documentation for .env file.

```env
# Next Auth
AUTH_SECRET=<INFO https://next-auth.js.org/configuration/options#nextauth_secret>
NEXTAUTH_URL=<URL OF APPLICATION INCLUDING PROTOCAL>

# Github SSO
GITHUB_ID=<GITHUB AUTH ID>
GITHUB_SECRET=<GITHUB AUTH SECRET>
```