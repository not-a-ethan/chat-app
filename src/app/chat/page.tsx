'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image';

import React, { useState } from "react";

import { useSession } from "next-auth/react"

import styles from "../styles/chat.module.css";

import { send } from 'process';

export default function Home() {
  const { data: session, status } = useSession()
  const router = useRouter();

  const [room, setRoom] = useState(0);

  if (status === "loading") {
    return <p>Loading</p>
  }

  if (status === "unauthenticated") {
    router.replace("/api/auth/signin");
    return (<p>Access Denied</p>);
  }

  function createMessage() {
    const textAreaElm: any = document.getElementById("messageContent");
    const messageContent: String = textAreaElm?.value;

    if (messageContent.trim() === "") {
      return;
    }
    
    fetch("../api/message/create", {
      method: "POST",
      body: JSON.stringify({
        "roomID": room,
        "content": messageContent
      })
    }).then(response => response.status !== 200 ? console.log("Something went wrong"): textAreaElm.value = "")
  }

  return (
    <>
      <div className={styles.room}>
        <div className={styles.messages}>
          <p>Messages</p>

          <div className={`${styles.messageInput}`} >
            <textarea className={`${styles.textArea}`} id="messageContent"></textarea>

            <img
              src={`/arrow-right.svg`}
              alt="Right arrow to send the message"
              className={`${styles.sendButton}`}
              onClick={createMessage}
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
