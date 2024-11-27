import { NextRequest, NextResponse } from 'next/server'

import { getToken } from "next-auth/jwt"

import { getAll } from "@/app/database/get"
import { changeDB } from "@/app/database/change"

export async function GET(req: NextRequest, res: NextResponse) {
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
        username = getAll(`SELECT * FROM users WHERE externalID=${externalID}`)
    } else {
        externalID = NaN;
        username = "";
    }

    const body = await req.json();
    const roomID: Number = body["roomID"] | 1;
    const messageContent: String = body["content"];

    const response = changeDB(`INSERT INTO messages (author, content, roomID) values (${username}, ${messageContent}, ${roomID}`)

    console.log(response)

    return NextResponse.json(
        JSON.stringify(body),
        {status: 200}
    )
}