'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image';

import React, { useState, useEffect } from "react";

import { useSession } from "next-auth/react"

import styles from "../styles/chat.module.css";

import { send } from 'process';

export default function Home() {
  const { data: session, status } = useSession()
  const router = useRouter();

  const [room, setRoom] = useState(0);
  const [roomsRendered, setRoomsRenderd] = useState(false);

  function getRooms(divElement: HTMLDivElement) {
    if (roomsRendered) {
      return;
    } else {
      let data: any;
      let rooms = '';

      if (divElement === null) {
        return;
      }

      fetch("../api/rooms/get", {
        method: "GET"
      })
      .then(response => data = response)
      .then(response => response.json())
      .then(jsonData => {
        jsonData = JSON.parse(jsonData)
        if (data.status !== 200) {
          console.log("Something went wrong")
        }

        rooms = jsonData["rooms"]
        const roomsArray = rooms.split(",")

        setRoom(Number(roomsArray[0]));

        if (rooms.length === 0) {} else if (rooms.length === 1) {
          const room = document.createElement("span");
          room.className = styles.singleRoom;
          room.innerText = roomsArray[0]
          room.id = roomsArray[0];
          room.onclick = setRoomFunc;

          divElement.appendChild(room)
        } else {
          const numRooms = roomsArray.length;

          for (let i = 0; i < numRooms; i++) {
            const room = document.createElement("span");
            room.className = styles.singleRoom;
            room.innerText = roomsArray[i]
            room.id = roomsArray[i];
            room.onclick = setRoomFunc;

            divElement.appendChild(room)
          }
        }   
      })
      setRoomsRenderd(true);
    }
  }

  useEffect(() => {
    if (roomsRendered) return;
    const divElement: HTMLDivElement = document.getElementById('roomList');
    getRooms(divElement);
  })

  function setRoomFunc(e: any) {
      let id;

      try {
          id = e.target.id;
          
      } catch (error) {
          console.log(error)
          return;
      }

      setRoom(id)
}

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

      <div className={`${styles.rooms}`} id="roomList"></div>
    </>
  );
}
