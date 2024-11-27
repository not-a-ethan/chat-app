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

    console.log("\n")
    console.log(token)
    console.log("\n")

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
    const roomID: Number = body["roomID"] | 1;
    const messageContent: String = body["content"];

    if (typeof roomID !== Number) {
        return NextResponse.json(
            JSON.stringify({"error": "roomID is not a number"}),
            { status: 400 }
        )
    }



    const response = await changeDB(`INSERT INTO messages (author, content, roomID) values ($username, $content, $id)`, {username: username, content: messageContent, id: roomID})

    console.log(response)

    return NextResponse.json(
        JSON.stringify(body),
        {status: 200}
    )
}