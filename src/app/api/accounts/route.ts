import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest, res: NextResponse) {
    console.log("Testing this [/api/accounts/route line 4]")
    const body = await req.json();

    console.log("\n\n")
    console.log(body);
    console.log("\n\n")

    return NextResponse.json(
        JSON.stringify(body),
        {status: 200}
    )
}