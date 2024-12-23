'use client'

import React, { useState, useContext, forwardRef, useEffect } from "react";

import { Button } from "@nextui-org/button";

import toast from "react-hot-toast";

import { Room } from "../page";

export default function ActiveUsers() {
    const [users, setUsers] = useState(<></>);

    const [room, setRoom] = useContext(Room);

    function addUser() {
      const username = prompt("Username of who you want to add:");
      let data: any;

      if (username == undefined || username?.trim() == '') return;

      const addUser = fetch("../api/rooms/addMember", {
        method: "POST",
        body: JSON.stringify({
          "roomID": room,
          "username": username
        })
      });
      
      toast.promise(addUser, {
        loading: "Creating room",
        success: "Created the room",
        error: "Error creating the room, please try again"
      });
    }

    function getActiveMembers() {
        if (!document.hasFocus()) return;
        let data: any;
    
        const roomID = sessionStorage.getItem("room");

        if (Number(roomID) == 0) return;
    
        const promise = fetch(`../api/rooms/activeMembers?roomID=${roomID}`, {
          method: "GET"
        })
        .then(response => data = response)
        .then(response => response.json())
        .then(jsonData => {
          if (data.status !== 200) {
            toast.error("Something went wrong getting active members");
            return;
          }
    
          jsonData = JSON.parse(jsonData);
    
          const users: Array<String> = jsonData['users'];
    
          setUsers(
            <div>
              {users.map((user: any) => (
                <div key={user}>{user}</div>
              ))}

              <br />
              <Button onPress={addUser}>
                Add Member
              </Button>
            </div>
          );
        });
      }

    useEffect(() => {
        getActiveMembers();
        setInterval(getActiveMembers, 5000);
    }, [room]);

    return users;
}