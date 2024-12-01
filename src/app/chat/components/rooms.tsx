'use client'

import React, { useState, useContext, forwardRef, useEffect } from "react";

import { Room } from "../page";

import styles from "./styles/rooms.module.css"

export default function Rooms() {
    const [roomsRendered, setRoomsRenderd] = useState(false);
    const [roomsDiv, setRoomsDiv] = useState(<></>);
    const [room, setRoom] = useContext(Room)

    function setRoomFunc(e: any) {
        let id;
  
        try {
            id = e.target.id;
        } catch (error) {
            console.log(error)
            return;
        }
  
        setRoom(id)
        sessionStorage.setItem('room', id);
    }

    function createRoom() {
      const roomName = prompt("What should the room be called?");
      let data: any;

      fetch("../api/rooms/create", {
        method: "POST", 
        body: JSON.stringify({
          "name": roomName
        })
      })
      .then(response => data = response)
      .then(response => response.json())
      .then(jsonData => {
        if (data.status !== 200) {
          console.log("Something went wrong")
          return;
        }

        getRooms();
      })
    }
    
    function getRooms() {
        if (roomsRendered) {
          return;
        } else {
          let data: any;
          let rooms = '';
    
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
            roomsArray.pop();
    
            setRoom(Number(roomsArray[0]));
            sessionStorage.setItem('room', roomsArray[0]);

            setRoomsDiv(
                <span>
                    {roomsArray.map((thisRoom: any) => (
                        <span className={`${styles.singleRoom}`} id={thisRoom} key={thisRoom} onClick={setRoomFunc}>{thisRoom}</span>
                    ))}

                  <span className={`${styles.singleRoom}`} onClick={createRoom}>+ Create room</span>
                </span>
            )
          })
          setRoomsRenderd(true);
        }
      }

      getRooms();

      return roomsDiv;
}