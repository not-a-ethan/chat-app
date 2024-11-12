import { NextRequest, NextResponse } from 'next/server'

import { accountExists } from "../../../../../lib/accountExists"

export async function handeler(req: NextRequest, res: NextResponse) {
    const exists = accountExists("sso", "not-a-ethan", 92686703)

    console.log("\n\nTesting this [/api/account/exists line 8]")
    //const body = await req.json();
    //console.log(body);
    //console.log("\n\n")

    const user = { id: "1", name: "J Smith", email: "jsmith@example.com" }

    return NextResponse.json(
        JSON.stringify(user),
        {status: 200}
    )
}

export { handeler as GET, handeler as POST, handeler as PUT }