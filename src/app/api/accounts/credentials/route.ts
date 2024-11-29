import { NextRequest, NextResponse } from 'next/server'

import bcrypt from "bcrypt";

import { accountExists } from '@/lib/accountExists';
import { createAccount } from '@/lib/createAccount';
import { checkCredentials } from "@/lib/checkCredentials";
import { updateActivity } from "@/lib/updateActivity"

export async function POST(req: NextRequest, res: NextResponse) {
    interface bodyType {
        csrfToken: String,
        username: String,
        password: String
    };

    const body: bodyType = await req.json();
    const username: String = body.username;
    const password: String = body.password;

    const exists = await accountExists("credentials", username, -1)

    if (exists) {
        const correct: boolean = await checkCredentials(username, password);

        if (correct) {
            return NextResponse.json(
                {"success": true},
                {status: 200}
            )
        }

        return NextResponse.json(
            {"success": false},
            {status: 401}
        )
    }

    const saltRounds = 20;
    await bcrypt.genSalt(saltRounds, function(err: any, salt: any) {
        bcrypt.hash(password, salt, function(err: any, hash: any) {
            const account: boolean = createAccount("credentials", username, hash, null, null);

            if (account) {
                updateActivity(username);
                
                return NextResponse.json(
                    {"success": true},
                    {status: 200}
                )
            }

            return NextResponse.json(
                {"success": false},
                {status: 401}
            )
        });
    });

    return NextResponse.json(
        {"success": false},
        {status: 500}
    )
}