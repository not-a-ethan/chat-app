# Chat app

Chat app with a similer concept to discord.

## Features

- Accounts
  - Create
  - Change username
  - Change password
  - Change pfp
  - Change name
- Rooms
    - Create
    - Add memember
    - Remove member
    - Delete
- Messages
    - Create
    - Edit
    - React
    - Delete

## Development

### Tech Stack

This project uses a few diffrent frameworks and liberies.

- Next.js
- NextUI
- Next Auth
- SQLite DB
- Bcrypt

### Getting Started

Make sure you make the db. The docs for the db layout is located at '/src/app/database/DB docs.md' and the `.env` file (docs below)

___

Documentation for .env file.

```env
# Next Auth
AUTH_SECRET=<INFO https://next-auth.js.org/configuration/options#nextauth_secret>
NEXTAUTH_URL=<URL OF APPLICATION INCLUDING PROTOCAL>

# Github SSO
GITHUB_ID=<GITHUB AUTH ID>
GITHUB_SECRET=<GITHUB AUTH SECRET>

# Site Config
allowAttachmenbts=<0 to not allow, 1 to allow>
filter=<comma sperated list of banned phrases>
```

### Running the program

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