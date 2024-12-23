'use client'

import React from "react";

import { Textarea } from "@nextui-org/input";

import toast from "react-hot-toast";

import styles from "./styles/createMessage.module.css";

export default function DraftMessage() {
    function createMessage() {
        const room = sessionStorage.getItem("room");

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
        });
    }

    return (
        <div className={`${styles.messageInput}`} >
            <Textarea className={`${styles.textArea}`} id="messageContent"></Textarea>

            <img
            src={`/arrow-right.svg`}
            alt="Right arrow to send the message"
            className={`${styles.sendButton}`}
            onClick={createMessage}
            />
        </div>
    );
}