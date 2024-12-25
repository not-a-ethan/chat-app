import { NextRequest, NextResponse } from 'next/server'

import { getToken } from "next-auth/jwt"

import { getAll } from "@/app/database/get"

import accountInfo from '@/utils/accountinfo'

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

    // Gets info about account
    const info = await accountInfo(token);
    const username = info.username;

    // Gets the rooms from the DB and formats array correctly.
    let rooms = await getAll(`SELECT * FROM users WHERE username=$username`, {"$username": username});
    rooms = rooms[0]["rooms"];

    if (rooms === null || rooms === undefined || rooms.length === 0) {
        return NextResponse.json(
            JSON.stringify({
                "rooms": [],
                "names": []
            }),
            {status: 200}
        )
    }

    rooms = rooms.replace('0,', '');
    rooms = rooms.split(",");
    rooms.pop(); 
    rooms.sort();
    rooms = rooms.join(",")
    rooms += ","

    let roomArr = rooms.split(",")
    roomArr.pop();
    
    // Gets the names of all the rooms from DB
    const names = [];
    const finalRooms = [];
    
    for (let i = 0; i < roomArr.length; i++) {
        let currentName = await getAll(`SELECT name FROM rooms WHERE id=${roomArr[i]}`, {}); 
        if (currentName.length === 0) {
            continue;
        }

        finalRooms.push(roomArr[i])
        currentName = currentName[0]["name"];
        names.push(currentName);
    }   

    // Updates the time the user was last active
    updateActivity(username);

    return NextResponse.json(
        JSON.stringify({
            "rooms": finalRooms.join(",") + ",",
            "names": names
        }),
        {status: 200}
    )
}