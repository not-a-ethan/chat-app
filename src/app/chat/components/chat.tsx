'use client'

import React, { useState, useContext, forwardRef, useEffect } from "react";

import toast from "react-hot-toast";

import { Room } from "../page";

import styles from "./styles/chat.module.css";

const Chat = forwardRef((props: any, ref: any) => {
    const [messages, setMessages] = useState(<></>);
    const [room, setRoom] = useContext(Room);

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
                toast.error("Something went wrong when getting messages");
                return;
            }

            jsonData = JSON.parse(jsonData);

            const messages = jsonData['messages'].reverse();

            setMessages(
                <div className={styles.chat}>
                    {messages.map((message: any) => (
                        <div key={message.id}>
                            <p className={`${styles.author}`}>{message.author}</p>
                            <p className={`${styles.message}`}> &nbsp; &nbsp; {message.content}</p>
                        </div>
                    ))}
                </div>
            );
        })
    }

    useEffect(() => {
        loadMessages();
        setInterval(loadMessages, 5000);
    }, [room]);
    
    return messages;
});

export default Chat;