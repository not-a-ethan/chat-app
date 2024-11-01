'use client'

import Providers from "./providers";

import "./styles/globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Providers session={null}>
          {children}
      </Providers>
    </html>
  );
}
