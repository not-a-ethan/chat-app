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

    // Gets the rooms from the DB
    let rooms = await getAll(`SELECT * FROM users WHERE username=$username`, {"$username": username});
    rooms = rooms[0]["rooms"];
    rooms = rooms.replace('0,', '');

    // Updates the time the user was last active
    updateActivity(username);

    return NextResponse.json(
        JSON.stringify({
            "rooms": rooms
        }),
        {status: 200}
    )
}