'use client'

import React, { useState, useContext, forwardRef, useEffect } from "react";

import { Room } from "../page";

export default function ActiveUsers() {
    const [users, setUsers] = useState(<></>);

    const [room, setRoom] = useContext(Room)

    function getActiveMembers() {
        if (!document.hasFocus()) return;
        let data: any;
    
        const roomID = sessionStorage.getItem("room");

        if (Number(roomID) == 0) return;
    
        fetch(`../api/rooms/activeMembers?roomID=${roomID}`, {
          method: "GET"
        })
        .then(response => data = response)
        .then(response => response.json())
        .then(jsonData => {
          if (data.status !== 200) {
            console.log("Something went wrong")
            return;
          }
    
          jsonData = JSON.parse(jsonData)
    
          const users: Array<String> = jsonData['users'];
    
          setUsers(
            <div>
              {users.map((user: any) => (
                <div key={user}>{user}</div>
              ))}
            </div>
          )
        })
      }

    useEffect(() => {
        getActiveMembers();
        setInterval(getActiveMembers, 5000);
    }, [room])

    return users;
}