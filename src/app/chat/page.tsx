'use client'

import { useRouter } from 'next/navigation'

import React from "react";

import { useSession } from "next-auth/react"

import styles from "../styles/chat.module.css";

export default function Home() {
  const { data: session, status } = useSession();
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
      <div className={styles.room}>
        <div className={styles.messages}>
          <p>Messages</p>
        </div>

        <div className={styles.people}>
          <p>People in room</p>
        </div>
      </div>
    </>
  );
}
