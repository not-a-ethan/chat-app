'use client'

import React, { useState, useContext, forwardRef, useEffect } from "react";

import { Room } from "../page";

const Chat = forwardRef((props: any, ref: any) => {
    const [messages, setMessages] = useState(<></>)
    const room = useContext(Room)

    function loadMessages() {
        if (!document.hasFocus()) return;

        let data: any; 

        const roomID = sessionStorage.getItem("room");

        if (Number(roomID) == 0) return;

        fetch(`../api/rooms/message?roomID=${Number(roomID)}`)
        .then(response => data = response)
        .then(response => response.json())
        .then(jsonData => {
            if (data.status !== 200) {
            console.log("Something went wrong")
            return;
            }

            jsonData = JSON.parse(jsonData)

            const messages = jsonData['messages'];

            setMessages(
                <div>
                    {messages.map((message: any) => (
                        <div key={message.id}>{message.content}</div>
                    ))}
                </div>
            );
        })
    }

    useEffect(() => {
        loadMessages();
        setInterval(loadMessages, 5000);
    }, [room])
    
    return messages
});

export default Chat;