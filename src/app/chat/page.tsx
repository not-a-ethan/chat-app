'use client'

import { useRouter } from 'next/navigation'

import React, { useState, useEffect, createContext } from "react";

import { useSession } from "next-auth/react"

import Chat from './components/chat';
import ActiveUsers from './components/activeUsers';
import Rooms from './components/rooms';

import styles from "../styles/chat.module.css";

export const Room = createContext(0);

export default function Home() {
  const { data: session, status } = useSession()
  const router = useRouter();

  const [room, setRoom] = useState(0);
  const [roomsRendered, setRoomsRenderd] = useState(false);

  if (status === "loading") {
    return <p>Loading</p>
  }

  if (status === "unauthenticated") {
    router.replace("/api/auth/signin");
    return (<p>Access Denied</p>);
  }

  function createMessage() {
    const textAreaElm: any = document.getElementById("messageContent");
    const messageContent: string = textAreaElm?.value;

    if (messageContent.trim() === "") {
      return;
    }
    
    fetch("../api/message/create", {
      method: "POST",
      body: JSON.stringify({
        "roomID": room,
        "content": messageContent
      })
    }).then(response => {
      return response.status !== 200 ? "Something went wrong": textAreaElm.value = ""
    })
  }

  return (
    <>
      <Room.Provider value={[room, setRoom]}>
        <div className={styles.room}>
          <div className={styles.messages}>
            <span className={`${styles.chatMessages}`}>
              <Chat />
            </span>
            
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

          <div className={styles.people} id="people"><ActiveUsers /></div>     
        </div>

        <div className={`${styles.rooms}`} id="roomList"><Rooms /></div>
      </Room.Provider>
    </>
  );
}
