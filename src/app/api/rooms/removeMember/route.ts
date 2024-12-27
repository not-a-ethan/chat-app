import { NextRequest, NextResponse } from 'next/server'

import { getToken } from "next-auth/jwt"

import { getAll } from "@/app/database/get"
import { changeDB } from "@/app/database/change"

import accountInfo from '@/utils/accountinfo'

import { updateActivity } from "@/lib/updateActivity"

async function removeUser(roomID: Number, userid: number) {
    const sqlCurrentRooms = await getAll(`SELECT rooms FROM users WHERE id=$id`, {"$id": userid});
    const currentRooms = sqlCurrentRooms[0]["rooms"];
    const newRooms = currentRooms.split(",").splice(currentRooms.indexOf(roomID), 1).join(",") + ",";

    const query = `UPDATE users SET rooms=$rooms WHERE id=$userID`;
    const result = changeDB(query, {"$rooms": newRooms, "$userID": userid});

    return result;
}

export async function POST(req: NextRequest) {
    // Get info about user authentication
    const token = await getToken({ req });

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
    const roomID: Number = body["roomID"];
    const removeID: number = body["userID"];

    // checks to see if the current user is in the room
    const sqlRooms = await getAll(`SELECT rooms FROM users WHERE id='${removeID}';`, {});
    const rooms: string = sqlRooms[0]["rooms"];

    if (!rooms.includes(`,${roomID},`)) {
        return NextResponse.json(
            JSON.stringify({
                "error": "You are not in that room"
            }),
            { status: 400 }
        );
    }

    // Checks to make sure its not the dummy room
    if (roomID == 0) {
        return NextResponse.json(
            JSON.stringify({
                error: `Hey that room is not allowed. 0 Is just to make the DB happy so every user is "in" atleast one room.`
            }),
            { status: 418 }
        );
     }

    // Checks to make sure there is an actual username
    if (removeID.toString() == "") {
        return NextResponse.json(
            JSON.stringify({
                "error": "No id provided"
            }),
            { status: 400 }
        )
    }

    // Adds the user
    const result = await removeUser(roomID, removeID);

    // Updates the time the user was last active
    updateActivity(username);

    if (!result) {
        return NextResponse.json(
            JSON.stringify({
                "error": "Something went wrong"
            }),
            { status: 500 }
        );
    }

    return NextResponse.json(
        JSON.stringify(body),
        {status: 200}
    );
}