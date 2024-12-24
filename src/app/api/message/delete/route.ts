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
    let username = info.username;
    let id = info.id;
    

    const body = await req.json();
    const messageID: Number = body["messageID"];

    // Checks to make sure the message exists & the user created thew  message
    const messageQuery: String = "SELECT * FROM messages WHERE 'author'=$id AND 'id'=$messageid";
    const message = await getAll(messageQuery, {"$id": id, "$messageID": messageID})

    if (message.length === 0) {
        return NextResponse.json(
            JSON.stringify({
                error: "You do not own that message"
            }),
            { status: 403 }
        )
    }

    // Deletes the message
    const query: String = "DELETE FROM messages WHERE 'messageID'=$messageID AND 'author'=$authorID"
    const response = await changeDB(query, {$messageID: messageID, $authorID: id})

    // Updates the time the user was last active
    updateActivity(username);

    return NextResponse.json(
        JSON.stringify(response),
        {status: 200}
    )
}