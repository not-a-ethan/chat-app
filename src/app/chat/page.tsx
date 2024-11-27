'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image';

import React from "react";

import { useSession } from "next-auth/react"

import styles from "../styles/chat.module.css";

import { send } from 'process';

export default function Home() {
  const { data: session, status } = useSession()
  const router = useRouter();

  if (status === "loading") {
    return <p>Loading</p>
  }

  if (status === "unauthenticated") {
    router.replace("/api/auth/signin");
    return (<p>Access Denied</p>);
  }

  /*
  fetch("http://localhost:3001/api/message/create", {
    method: "POST",
    body: JSON.stringify({
      "roomID": 1,
      "content": "Some Content"
    })
  })
  */

  return (
    <>
      <div className={styles.room}>
        <div className={styles.messages}>
          <p>Messages</p>

          <div className={`${styles.messageInput}`} >
            <textarea className={`${styles.textArea}`}></textarea>
            <img
              src={`/arrow-right.svg`}
              alt="Right arrow to send the message"
              className={`${styles.sendButton}`}
            />
          </div>
        </div>

        <div className={styles.people}>
          <p>People in room</p>
        </div>
      </div>
    </>
  );
}
