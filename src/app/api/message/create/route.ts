import { NextRequest, NextResponse } from 'next/server';

import { getToken } from "next-auth/jwt";

import { getAll } from "@/app/database/get";
import { changeDB } from "@/app/database/change";

import accountInfo from '@/utils/accountinfo';

import { updateActivity } from "@/lib/updateActivity";

export async function POST(req: NextRequest, res: NextResponse) {
    // Get info about user authentication
    const token = await getToken({ req })

    // Checks if user is logged in
    if (!token) {
        return NextResponse.json(
            JSON.stringify(
                {"message": "Not authenticated"},
            ),
            {status: 403}
        );
    }

    // Gets info about account
    const info = await accountInfo(token);
    const username = info.username;
    const userID = info.id;

    const body = await req.json();
    const roomID: Number = body["roomID"];
    const messageContent: String = body["content"];

    // Make sure its not the dummy room
    if (roomID == 0) {
        return NextResponse.json(
            JSON.stringify({
                error: `Hey that room is not allowed. 0 Is just to make the DB happy so every user is "in" atleast one room.`
            }),
            { status: 418 }
        )
     }

    // Checks to make sure the message is not empty or just whitespaces
    if (messageContent.trim() === "") {
        return NextResponse.json(
            JSON.stringify({
                "error": "Empty message"
            }),
            { status: 400 }
        )
    }


    // Gets all the rooms the user is in, and makes sure the messagee is for one of htose rooms
    let rooms = await getAll(`SELECT * FROM users WHERE username=$username`, {"$username": username});
    rooms = rooms[0]["rooms"];
    
    if (!rooms.includes(roomID)) {
        return NextResponse.json(
            JSON.stringify({
                "error": "Not in room"
            }),
            { status: 403}
        )
    }

    // Sends the message
    const response = changeDB(`INSERT INTO messages (author, zcontent, roomID, created) values ($userID, $content, $id, ${Date.now()})`, {$userID: userID, $content: messageContent, $id: roomID})

    // Updates the time the user was last active
    updateActivity(username);

    return NextResponse.json(
        JSON.stringify(body),
        {status: 200}
    )
}