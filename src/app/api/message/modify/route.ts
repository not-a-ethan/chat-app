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
    const id = info.id;
    const username = info.username;

    const body = await req.json();
    const messageID = body["messageID"];
    const newMessageContent: String = body["content"];

    // Checks to make sure the message exists & the user created thew  message
    const messageQuery: String = `SELECT * FROM messages WHERE id=$i AND author=${id};`;
    const messageQueryAguemnts = {"$i": messageID[0]};
    const message = await getAll(messageQuery, messageQueryAguemnts);

    if (message.length === 0) {
        return NextResponse.json(
            JSON.stringify({
                error: "You do not own that message"
            }),
            { status: 403 }
        );
    }

    // Updates the message
    const query: String = `UPDATE messages SET content=$message WHERE id=$messageID AND author=${id};`;
    const updateParams = {$message: newMessageContent, $messageID: messageID[0]}
    const response = changeDB(query, updateParams);

    // Updates the time the user was last active
    updateActivity(username);

    return NextResponse.json(
        JSON.stringify(body),
        {status: 200}
    )
}