import { NextRequest, NextResponse } from 'next/server'

import { getToken } from "next-auth/jwt"

import { getAll } from "@/app/database/get"
import { changeDB } from "@/app/database/change"

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
    let id;

    if (token.sub) {
        externalID = token.sub;
        id = await getAll(`SELECT * FROM users WHERE externalID=$id`, {"$id": externalID});
        id = id[0].id;
    } else {
        externalID = NaN;
        id = -1;
    }
    

    const body = await req.json();
    const messageID: Number = body["messageID"];
    const newMessageContent: String = body["content"];

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

    const query: String = "UPDATE users SET 'content'='$message' WHERE 'messageID'=$messageID AND 'author'=$authorID"
    const response = await changeDB(query, {$message: newMessageContent, $messageID: messageID, $authorID: id})

    return NextResponse.json(
        JSON.stringify(body),
        {status: 200}
    )
}