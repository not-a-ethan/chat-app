import { NextRequest, NextResponse } from 'next/server'

import { getToken } from "next-auth/jwt"

import { getAll } from "@/app/database/get"

import accountInfo from '@/utils/accountinfo';

import { updateActivity } from '@/lib/updateActivity';

export async function GET(req: NextRequest, res: NextResponse) {
    // Check auth status
    const token = await getToken({ req });

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

    // Get room ID
    const searchParams = req.nextUrl.searchParams;
    const roomID: number = Number(searchParams?.get("roomID"));

    // Validates room ID
    if (roomID < 1) {
        return NextResponse.json(
            JSON.stringify({
                "error": "Room ID needs to be more than 1"
            }),
            { status: 400 }
        )
    }

    // Checks if user is in the room
    let rooms = await getAll(`SELECT * FROM users WHERE username=$username`, {"$username": username});
    rooms = rooms[0]["rooms"];
    
    if (!rooms.includes(roomID)) {
        return NextResponse.json(
            JSON.stringify({
                "error": "Not in room"
            }),
            { status: 403 }
        )
    }

    // Updates the time the user was last active
    updateActivity(username);

    // Gets the messages
    const messages = await getAll(`SELECT * FROM messages WHERE roomID=$roomID ORDER BY id ASC LIMIT 25;`, {"$roomID": roomID});

    for (let i = 0; i < messages.length; i++) {
        if (messages[i]["author"] == userID) {
            messages[i].isAuthor = true;
            messages[i].username = username;
        } else {
            messages[i].isAuthor = false;

            const userResult = await getAll(`SELECT username FROM users WHERE id=${messages[i].author}`);
            messages[i].username = userResult[0].username;
        }
    }

    return NextResponse.json(
        JSON.stringify({
            "messages": messages
        }),
        {status: 200}
    )
}