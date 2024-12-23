'use client'

import React, { useState, useContext, forwardRef, useEffect } from "react";

import { Avatar } from "@nextui-org/avatar";

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

            function formatDate(unixTimestamp: number) {
                const date = new Date(unixTimestamp);
                const offset = date.getTimezoneOffset();
                const formattedDate = Intl.DateTimeFormat(navigator.language, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                }).format(date);

                return formattedDate;
            }

            setMessages(
                <div className={styles.chat}>
                    {messages.map((message: any) => (
                        <div key={message.id}>
                            <Avatar name={message.author} className={`${styles.avatar}`} /> <span>{message.author}</span> <span className={`${styles.timestamp}`}>{formatDate(message.created)}</span>
                            <p className={`${styles.message}`}> &nbsp; &nbsp; {message.content}</p>
                        </div>
                    ))}
                </div>
            );
        });
    }

    useEffect(() => {
        loadMessages();
        setInterval(loadMessages, 5000);
    }, [room]);
    
    return messages;
});

export default Chat;