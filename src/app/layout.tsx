import { getSession } from "next-auth/react"

import Providers from "./providers";

import "./styles/globals.css";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession()

  return (
    <html lang="en">
        <body>
            <Providers session={session}>
                {children}
            </Providers>
        </body>
    </html>
  );
}
