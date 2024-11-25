import '../styles/globals.css'
import type { AppProps } from 'next/app'

import { SessionProvider } from "next-auth/react"

function MyApp({
   Component, 
   pageProps: { session, ...pageProps }, 
  }: AppProps) {
   return (
    <html>
      <body>
        <Component {...pageProps} />
      </body>
    </html>   
   )
}

export default MyApp