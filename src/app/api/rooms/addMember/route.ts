import { NextRequest, NextResponse } from 'next/server'

import { getToken } from "next-auth/jwt"

import { getAll } from "@/app/database/get"

import accountInfo from '@/utils/accountinfo'

import { updateActivity } from "@/lib/updateActivity"

import { addUser } from '../create/addUser';

export async function POST(req: NextRequest) {
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

    const body = await req.json();
    const roomID: number = body["roomID"];
    const addUsername: string = body["username"];

    // checks to see if the current user is in the room
    const sqlRooms = await getAll(`SELECT rooms FROM users WHERE username='${username}';`, {});
    const rooms: string = sqlRooms[0]["rooms"];

    if (!rooms.includes(`,${roomID},`)) {
        return NextResponse.json(
            JSON.stringify({
                "error": "You are not in that room"
            }),
            { status: 400 }
        )
    }

    // Checks to make sure its not the dummy room
    if (roomID == 0) {
        return NextResponse.json(
            JSON.stringify({
                error: `Hey that room is not allowed. 0 Is just to make the DB happy so every user is "in" atleast one room.`
            }),
            { status: 418 }
        )
     }

    // Checks to make sure there is an actual username
    if (addUsername.trim() == "") {
        return NextResponse.json(
            JSON.stringify({
                "error": "No username provided"
            }),
            { status: 400 }
        )
    }

    // Adds the user
    const result = await addUser(roomID, addUsername);

    // Updates the time the user was last active
    updateActivity(username);

    if (!result) {
        return NextResponse.json(
            JSON.stringify({
                "error": "Something went wrong"
            }),
            { status: 500 }
        )
    }

    return NextResponse.json(
        JSON.stringify(body),
        {status: 200}
    )
}