import { NextRequest, NextResponse } from 'next/server'

import { accountExists } from '@/lib/accountExists';
import { getAll } from '@/app/database/get';

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const username: string = searchParams?.get("username");

    const exists = await accountExists("credentials", username, -1);

    if (!exists) {
        return NextResponse.json(
            {"error": "No user with that username exists"},
            {status: 404}
        );
    }

    const query = `SELECT id FROM users WHERE username=$u`;
    const users = await getAll(query, {"$u": username});
    const id = users[0]["id"];

    return NextResponse.json(
        {"id": id},
        {status: 200}
    );
}