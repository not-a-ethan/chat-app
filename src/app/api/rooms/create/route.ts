import { NextRequest, NextResponse } from 'next/server'

import { getToken } from "next-auth/jwt"

import { getAll } from "@/app/database/get"
import { changeDB } from "@/app/database/change"

import { updateActivity } from "@/lib/updateActivity"
import { addUser } from '../addMember/route'

export async function POST(req: NextRequest, res: NextResponse) {
    const token = await getToken({ req })

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

    if (token.sub) {
        externalID = token.sub;
        username = await getAll(`SELECT * FROM users WHERE externalID=${externalID}`);
        username = username[0].username;
    } else {
        externalID = NaN;
        username = "";
    }

    const body = await req.json();
    const name = body["name"]

    const createQuery = `INSERT INTO rooms (name) VALUES ($name)`;
    const result = changeDB(createQuery, {"$name": name})

    const sqlRoomID = await getAll(`SELECT seq FROM sqlite_sequence WHERE name='rooms'`);
    const roomID = sqlRoomID[0]["seq"];

    const addedToRoom = addUser(roomID, username);
    
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