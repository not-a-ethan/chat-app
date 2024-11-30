'use client'

import { useRouter } from 'next/navigation';

import { useSession } from "next-auth/react";

import EditUsername from "./components/username";
import EditPassword from "./components/password";
import EditName from "./components/name";

export default function Manage() {
    const { data: session, status } = useSession()
    const router = useRouter();

    if (status === "loading") {
        return <p>Loading</p>
    }
    
    if (status === "unauthenticated") {
        router.replace("/api/auth/signin");
        return (<p>Access Denied</p>);
    }

    return (
      <>
        <EditUsername />
        <br />
        <EditPassword />
        <br />
        <EditName />
      </>
    );
  }  