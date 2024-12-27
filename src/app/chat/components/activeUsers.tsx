'use client'

import React, { useState, useContext, forwardRef, useEffect } from "react";

import { Button } from "@nextui-org/button";
import { Avatar } from "@nextui-org/react";

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
        loading: "Adding user",
        success: "Added the user to the room",
        error: "Error adding the user, please try again"
      });
    }

    function deleteRoom() {
      const confirmation = confirm("Are you sure you want to delet the room?");
      let data: any;

      if (!confirmation) return;

      const deleteRoom = fetch("../api/rooms/delete", {
        method: "POST",
        body: JSON.stringify({
          "id": room,
        })
      }).then((response) => {
        let json = response.json();
        if (!(response.status >= 200) || !(response.status < 300)) {
          return response.json().then(Promise.reject.bind(Promise))
        }
      });
      
      toast.promise(deleteRoom, {
        loading: "Deleting room",
        success: "Deleted the room",
        error: "Error deleting the room, please try again"
      });
    }

    function removeMember(e: any) {
      const id = e.target.id;
      let data: any;

      const addUser = fetch("../api/rooms/removeMember", {
        method: "POST",
        body: JSON.stringify({
          "roomID": room,
          "userID": id
        })
      });
      
      toast.promise(addUser, {
        loading: "Remvoing user",
        success: "Removed the user from the room",
        error: "Error removing the user, please try again"
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
                <div key={user}>
                  <Avatar src={user[2]} name={user[0]} /> <span>{user[0]}</span>
                  <Button isIconOnly id={user[1]} onPress={removeMember}>🗑️</Button>
                </div>
              ))}

              <br />
              <Button onPress={addUser}>
                Add Member
              </Button>

              <Button onPress={deleteRoom}>
                Delete room
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