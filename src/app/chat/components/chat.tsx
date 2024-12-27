'use client'

import React, { useState, useContext, forwardRef, useEffect } from "react";

import { Avatar } from "@nextui-org/avatar";
import { Button } from "@nextui-org/button";
import { Divider } from "@nextui-org/divider";

import toast from "react-hot-toast";

import { Room } from "../page";

import styles from "./styles/chat.module.css";

const Chat = forwardRef((props: any, ref: any) => {
    const [messages, setMessages] = useState(<></>);
    const [room, setRoom] = useContext(Room);

    function reaction(e: any) {
        const reactionObj = {
            "+1": 0,
            "-1": 1,
            "heart": 2
        };

        const elementID: string = e.target.id.split("-");
        const reactionID = elementID[0];
        const messageID = elementID[1];

        const response = fetch("../api/message/react", {
            method: "POST",
            body: JSON.stringify({
                messageID: messageID,
                reaction: reactionID
            })
        }).then(response => {
          if (response.status !== 200) {
            toast.error("Something went wrong getting active members");
            return;
          }
        })
    }

    function editMessage(e: any) {
        const messageID: string = e.target.id.split("-");

        const newContent = prompt("What should the message say now?");

        const response = fetch("../api/message/modify", {
            method: "POST",
            body: JSON.stringify({
                messageID: messageID,
                content: newContent
            })
        });

        toast.promise(response, {
            loading: "Editing message",
            error: "Something went wrong editing the message. Please try again",
            success: "Message was edited"
        });
    }

    function deleteMessage(e: any) {
        const messageID: string = e.target.id.split("-");

        const confirmation = confirm("Are you sure you want to delete the message? THIS CANNOT BE UNDONE");

        if (!confirmation) {
            return;
        }

        const response = fetch("../api/message/delete", {
            method: "POST",
            body: JSON.stringify({
                messageID: messageID,
            })
        });

        toast.promise(response, {
            loading: "Deleting message",
            error: "Something went wrong deleting the message. Please try again",
            success: "Message was deleted"
        });
    }

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
                            <Avatar src={message.pfp} name={message.username} className={`${styles.avatar}`} /> <span>{message.username}</span> <span className={`${styles.timestamp}`}>{formatDate(message.created)}</span>
                            <p className={`${styles.message}`}> &nbsp; &nbsp; {message.content}</p>
                            <div>
                                <Button size="sm" id={`0-${message.id}`} onPress={reaction}>👍 {message["+1"].substring(2).length/2}</Button>
                                <Button size="sm" id={`1-${message.id}`} onPress={reaction}>👎 {message["-1"].substring(2).length/2}</Button>
                                <Button size="sm" id={`2-${message.id}`} onPress={reaction}>❤️ {message["heart"].substring(2).length/2}</Button>
                                {message.isAuthor ? <span className={`${styles.authorActions}`}><Divider orientation="vertical" /> <Button size="sm" id={message.id} onPress={editMessage}>✏️</Button><Button size="sm" id={message.id} onPress={deleteMessage}>🗑️</Button></span> : ''}
                            </div>
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