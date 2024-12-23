import type { AppProps } from 'next/app';

import '../styles/globals.css';

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
   );
}

export default MyApp;