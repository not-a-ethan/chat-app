import { NextRequest, NextResponse } from 'next/server'

import { getToken } from "next-auth/jwt"

import bcrypt from "bcrypt";

import { checkCredentials } from '@/lib/checkCredentials';

import { getAll } from "@/app/database/get"
import { changeDB } from '@/app/database/change'

import { updateActivity } from '@/lib/updateActivity'

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

    let externalID;
    let username;
    let type;

    if (token.sub) {
        externalID = token.sub;
        username = await getAll(`SELECT * FROM users WHERE externalID=${externalID}`);
        username = username[0].username;
        type = "sso";
    } else {
        externalID = NaN;
        username = "";
    }

    const dbIdResult = await getAll(`SELECT id FROM users WHERE username='${username}';`);
    const id = dbIdResult[0]["id"];

    const body: any = await req.json();
    const newPassword = body["password"];
    const currentPassword = body['currentPassword'];

    let nullpassword = false;

    if (type == "sso") {
        const dbResult = await getAll(`SELECT * FROM users WHERE id=${id}`)
        const currentHash = dbResult[0]["password"]

        if (currentHash == null) {
            nullpassword = true;
        }
    }

    if (!nullpassword) {
        const passwordCorrect: boolean = await checkCredentials(username, currentPassword)
    
        if (!passwordCorrect) {
            return NextResponse.json(
                JSON.stringify({
                    error: "Password is not correct"
                }),
                { status: 403 }
            )
        }
    }

    updateActivity(username);
    
    await bcrypt.genSalt(10, async function(err: any, salt: any) {
        await bcrypt.hash(newPassword, salt, async function(err: any, hash: any) {
            if (err) {
                return NextResponse.json(
                    JSON.stringify({
                        "error": "Something went wrong"
                    }),
                    { status: 500}
                )
            }

            const query = `UPDATE users SET 'password'=$hash WHERE id='${id}'`;
            const result = changeDB(query, {"$hash": hash});

            if (result) {
                return NextResponse.json(
                    JSON.stringify({
                        "success": "Password changed"
                    }),
                    {status: 200}
                )
            } else {
                return NextResponse.json(
                    JSON.stringify({
                        "error": "Something went wrong chaning your password"
                    }),
                    {status: 500}
                )
            }
        })
    })

    return NextResponse.json(
        JSON.stringify({
            "success": "Password changed"
        }),
        {status: 200}
    )
}