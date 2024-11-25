import { NextRequest, NextResponse } from 'next/server'

import { getToken } from "next-auth/jwt"

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

    console.log(token);

    const body = await req.json();
    const roomID: Number = body["roomID"];
    const messageContent = body["content"];

    return NextResponse.json(
        JSON.stringify(body),
        {status: 200}
    )
}