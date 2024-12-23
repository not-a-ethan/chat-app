"use client"

import { useEffect, useState } from 'react';

import {NextUIProvider} from '@nextui-org/react'

import { SessionProvider } from "next-auth/react";

export default function Providers({children}: {children: React.ReactNode}) {
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        const matchMedia = window.matchMedia("(prefers-color-scheme: dark)");
  
        setDarkMode(matchMedia.matches);
    }, []);

    return (
        <NextUIProvider>
            <main className={`${darkMode ? "dark": "light"} text-foreground bg-background`}>
                <SessionProvider>
                    {children}
                </SessionProvider>
            </main> 
        </NextUIProvider>
    );
}