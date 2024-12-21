'use client'

import { useRouter } from 'next/navigation'

import React, { useState, useEffect, createContext } from "react";

import { useSession } from "next-auth/react"

import Chat from './components/chat';
import ActiveUsers from './components/activeUsers';
import Rooms from './components/rooms';
import DraftMessage from './components/createMessage';

import styles from "./chat.module.css";

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

  return (
    <>
      <Room.Provider value={[room, setRoom]}>
        <div className={styles.room}>
          <div className={styles.messages}>
            <span className={`${styles.chatMessages}`}>
              <Chat />
            </span>
            
            <span className={`${styles.draftMessage}`}>
              <DraftMessage />
            </span>
          </div>

          <div className={styles.people} id="people"><ActiveUsers /></div>     
        </div>

        <div className={`${styles.rooms}`} id="roomList"><Rooms /></div>
      </Room.Provider>
    </>
  );
}
