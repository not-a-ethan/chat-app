import { NextRequest, NextResponse } from 'next/server'

import { getToken } from "next-auth/jwt"

import { getAll } from "@/app/database/get"
import { changeDB } from '@/app/database/change'

import { updateActivity } from '@/lib/updateActivity'

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

    // Gets users ID from the DB
    const dbIdResult = await getAll(`SELECT id FROM users WHERE username='${username}';`);
    const id = dbIdResult[0]["id"];

    const body: any = await req.json();
    const newUsername = body["username"];

    // Updates the users username to the new one
    const query = `UPDATE users SET 'username'=$username WHERE id='${id}'`;
    const result = changeDB(query, {"$username": newUsername});

    // Updates the time the user was last active
    updateActivity(username);

    if (result) {
        return NextResponse.json(
            JSON.stringify({
                "users": "users"
            }),
            {status: 200}
        )
    }
    
    return NextResponse.json(
        JSON.stringify({
            "error": "Something went wrong"
        }),
        {status: 500}
    )
}