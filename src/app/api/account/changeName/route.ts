import { NextRequest, NextResponse } from 'next/server'

import { getToken } from "next-auth/jwt"

import { changeDB } from '@/app/database/change'

import accountInfo from '@/utils/accountinfo'
import { updateActivity } from '@/lib/updateActivity'

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
    const username: string = (await accountInfo(token)).username;

    const body: any = await req.json();
    const newName = body["name"];

    // Creates and runs SQL query that changes the current users name
    const query = `UPDATE users SET 'name'=$name WHERE username='${username}'`;
    const result = changeDB(query, {"$name": newName});

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