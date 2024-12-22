'use client'

import React, { useState, useContext, forwardRef, useEffect } from "react";

import toast from "react-hot-toast";

import { Room } from "../page";

import styles from "./styles/createMessage.module.css";

export default function DraftMessage() {
    const [room, setRoom] = useContext(Room)

    function createMessage() {
        const textAreaElm: any = document.getElementById("messageContent");
        const messageContent: string = textAreaElm?.value;

        if (messageContent.trim() === "") {
            return;
        }
        
        fetch("../api/message/create", {
            method: "POST",
            body: JSON.stringify({
                "roomID": room,
                "content": messageContent
            })
        }).then(response => {
            return response.status !== 200 ? toast.error("Something went wrong when sending the message"): textAreaElm.value = "";
        })
    }

    return (
        <div className={`${styles.messageInput}`} >
            <textarea className={`${styles.textArea}`} id="messageContent"></textarea>

            <img
            src={`/arrow-right.svg`}
            alt="Right arrow to send the message"
            className={`${styles.sendButton}`}
            onClick={createMessage}
            />
        </div>
    );
}