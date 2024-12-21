import { NextRequest, NextResponse } from 'next/server'

import { getToken } from "next-auth/jwt"

import { getAll } from "@/app/database/get"
import { changeDB } from "@/app/database/change"

import { updateActivity } from "@/lib/updateActivity"

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

    // for GH sso
    /*
    {
    name: 'name',
    email: 'email@example.com',
    picture: 'https://avatars.githubusercontent.com/u/something?v=4',
    sub: 'external id',
    iat: ?,
    exp: ?,
    jti: '?'
    }
   */

    let externalID;
    let username;

    // Gets info about user from DB
    if (token.sub) {
        externalID = token.sub;
        username = await getAll(`SELECT * FROM users WHERE externalID=${externalID}`);
        username = username[0].username;
    } else {
        externalID = NaN;
        username = "";
    }

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
    const response = changeDB(`INSERT INTO messages (author, 'content', roomID) values ($username, $content, $id)`, {$username: username, $content: messageContent, $id: roomID})

    // Updates the time the user was last active
    updateActivity(username);

    return NextResponse.json(
        JSON.stringify(body),
        {status: 200}
    )
}