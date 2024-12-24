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

    // Gets the rooms from the DB and formats array correctly.
    let rooms = await getAll(`SELECT * FROM users WHERE username=$username`, {"$username": username});
    rooms = rooms[0]["rooms"];
    rooms = rooms.replace('0,', '');
    rooms = rooms.split(",");
    rooms.pop(); 
    rooms.sort();
    rooms = rooms.join(",")
    rooms += ","

    let roomArr = rooms.split(",")
    roomArr.pop();
    
    // Gets the names of all the rooms from DB
    let names = [];
    for (let i = 0; i < roomArr.length; i++) {
        let currentName = await getAll(`SELECT name FROM rooms WHERE id=${roomArr[i]}`, {});
        currentName = currentName[0]["name"];
        names.push(currentName);
    }
    

    // Updates the time the user was last active
    updateActivity(username);

    return NextResponse.json(
        JSON.stringify({
            "rooms": rooms,
            "names": names
        }),
        {status: 200}
    )
}