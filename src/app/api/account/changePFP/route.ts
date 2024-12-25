import { NextRequest, NextResponse } from 'next/server'

import { getToken } from "next-auth/jwt"

import { changeDB } from '@/app/database/change'

import accountInfo from '@/utils/accountinfo'
import { updateActivity } from '@/lib/updateActivity'

export async function POST(req: NextRequest, res: NextResponse) {
    // Checks for if pfps are enabled
    if (!Boolean(process.env.allowAttachmenbts)) {
        return NextResponse.json(
            JSON.stringify({
                "error": "This instance does not allow attachments"
            }),
            { status: 403 }
        )
    }

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
    const userInfo= await accountInfo(token);
    const username = userInfo.username;
    const userID = userInfo.id;

    const body: any = await req.json();
    const newPfp = body["pfp"];
    const removing = body["removing"];

    // If user wants to remove their pfp
    if (removing) {
        const query = `UPDATE users SET pfp=${null} WHERE id=${userID}`;
        const result = changeDB(query, {});

        return NextResponse.json(
            JSON.stringify({
                "success": true
            }),
            { status: 200}
        )
    }

    // Creates and runs SQL query that changes the current users name
    const query = `UPDATE users SET pfp=$picture WHERE id=${userID}`;
    const result = changeDB(query, {"$picture": newPfp});

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