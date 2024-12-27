import { NextRequest, NextResponse } from 'next/server'

import { getToken } from "next-auth/jwt"

import { getAll } from "@/app/database/get"
import { changeDB } from "@/app/database/change"

import accountInfo from '@/utils/accountinfo'

import { updateActivity } from "@/lib/updateActivity"

import { addUser } from './addUser';

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
    const name = body["name"]

    // Creates the room
    const createQuery = `INSERT INTO rooms (name) VALUES ($name)`;
    const result = changeDB(createQuery, {"$name": name})

    // Gets the new roomID
    const sqlRoomID = await getAll(`SELECT seq FROM sqlite_sequence WHERE name='rooms'`);
    const roomID = sqlRoomID[0]["seq"];

    // Adds the creating user to the new room
    const addedToRoom = addUser((roomID + 1), username);

    // Updates the time the user was last active
    updateActivity(username);
    
    if (!result || !addedToRoom) {
        return NextResponse.json(
            JSON.stringify({
                "error": "Something went wrong"
            }),
            { status: 500 }
        )
    }

    return NextResponse.json(
        JSON.stringify({
            "roomID": roomID
        }),
        {status: 200}
    )
}