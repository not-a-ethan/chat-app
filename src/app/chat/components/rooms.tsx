'use client'

import React, { useState, useContext, forwardRef, useEffect } from "react";

import { Button } from "@nextui-org/button";

import toast from "react-hot-toast";

import { Room } from "../room";

import styles from "./styles/rooms.module.css";

export default function Rooms() {
    const [roomsRendered, setRoomsRenderd] = useState(false);
    const [roomsDiv, setRoomsDiv] = useState(<></>);
    let room = useContext(Room);

    function setRoomFunc(e: any) {
        let id;
  
        try {
            id = e.target.id;
        } catch (error) {
            console.log(error);
            return;
        }
  
        room = id;
        sessionStorage.setItem('room', id);
    }

    function createRoom() {
      const roomName = prompt("What should the room be called?");
      let data: any;

      if (roomName?.trim() === "" || roomName === null) {
        return;
      }

      const createRoom = fetch("../api/rooms/create", {
        method: "POST", 
        body: JSON.stringify({
          "name": roomName
        })
      }).then((response) => {
        let json = response.json();
        if (!(response.status >= 200) || !(response.status < 300)) {
          return response.json().then(Promise.reject.bind(Promise));
        }
      });

      toast.promise(createRoom, {
        loading: "Creating room",
        success: "Created the room",
        error: "Error creating the room, please try again"
      });

      getRooms();
    }
    
    function getRooms() {
        if (roomsRendered) {
          return;
        } else {
          let data: any;
    
          fetch("../api/rooms/get", {
            method: "GET"
          })
          .then(response => data = response)
          .then(response => response.json())
          .then(jsonData => {
            jsonData = JSON.parse(jsonData)
              if (!(data.status >= 200) || !(data.status < 300)) {
                return jsonData.then(Promise.reject.bind(Promise));
              }
    
            let rooms = jsonData["rooms"];
            let names = jsonData["names"];

            if (rooms.length === 0) {
              setRoomsDiv(
                <span>
                  <Button className={`${styles.singleRoom}`} onPress={createRoom}>+ Create room</Button>
                </span>
              );
              return;
            }

            const roomsArray = rooms.split(",");
            roomsArray.pop();

            const finalRooms = []

            for (let i = 0; i < roomsArray.length; i++) {
              finalRooms.push([roomsArray[i], names[i]]);
            }
    
            room = Number(roomsArray[0]);
            sessionStorage.setItem('room', roomsArray[0][0]);

            setRoomsDiv(
                <span>
                  {finalRooms.map((thisRoom: any) => (
                      <Button className={`${styles.singleRoom}`} id={thisRoom[0]} key={thisRoom[0]} onPress={setRoomFunc}>{thisRoom[1]}</Button>
                  ))}

                  <Button className={`${styles.singleRoom}`} onPress={createRoom}>+ Create room</Button>
                </span>
            );
          });
          setRoomsRenderd(true);
        }
      }

      getRooms();

      return roomsDiv;
}