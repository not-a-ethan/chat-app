import { NextRequest, NextResponse } from 'next/server'

import { getToken } from "next-auth/jwt"

import { getAll } from "@/app/database/get"

import { updateActivity } from '@/lib/updateActivity'

export async function GET(req: NextRequest, res: NextResponse) {
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

    let username;

    // Gets info about user from DB
    if (token.sub) {
        const externalID = token.sub;
        username = await getAll(`SELECT * FROM users WHERE externalID=${externalID}`);
        username = username[0].username;
    } else {
        username = token.email;
    }

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

    // Users active in the past 5 min and in a specific room
    const query = `SELECT * FROM users WHERE rooms LIKE CONCAT('%,', $room, ',%') AND recentlyActive > ((strftime('%s', 'now') * 1000) - 300000)`

    let users = await getAll(query, {"$room": roomID});
    const usernames = [];

    for (let i = 0; i < users.length; i++) {
        usernames.push(users[i].username);
    }
    
    return NextResponse.json(
        JSON.stringify({
            "users": usernames
        }),
        {status: 200}
    )
}