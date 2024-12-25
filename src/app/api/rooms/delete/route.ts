import { NextRequest, NextResponse } from 'next/server'

import { getToken } from "next-auth/jwt"

import { getAll } from "@/app/database/get"
import { changeDB } from "@/app/database/change"

import accountInfo from '@/utils/accountinfo'

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

    // Gets info about account
    const info = await accountInfo(token);
    const username = info.username;
    const userID = info.id;

    const body = await req.json();
    const roomID = body["id"];

    // Checks if user is in the room
    const isInRoomQuery = `SELECT rooms FROM users WHERE id=${userID}`;
    const inRoomResult = await getAll(isInRoomQuery, {});
    const isInRoom = inRoomResult[0]["rooms"].split(",").includes(roomID.toString());
    
    if (!isInRoom) {
        return NextResponse.json(
            JSON.stringify({
                "error": "You are not in that room"
            }),
            { status: 403 }
        );
    }

    // Checks that the room is empty exept current user
    const memberQuery = `SELECT * FROM users WHERE rooms LIKE CONCAT('%,', $room, ',%');`;
    const members = await getAll(memberQuery, {"$room": roomID});

    if (members.length > 1) {
        return NextResponse.json(
            JSON.stringify({
                "error": "There are still other people in the room"
            }),
            { status: 400}
        );
    }

    const deleteQuery = `DELETE FROM rooms WHERE id=$roomID;`;
    changeDB(deleteQuery, {"$roomID": roomID});

    // Updates the time the user was last active
    updateActivity(username);
    
    return NextResponse.json(
        JSON.stringify({
            "success": true
        }),
        {status: 200}
    );
}