import { NextRequest, NextResponse } from 'next/server'

import { getToken } from "next-auth/jwt"

import { getAll } from "@/app/database/get"
import { changeDB } from "@/app/database/change"

import accountInfo from '@/utils/accountinfo'

import { updateActivity } from "@/lib/updateActivity"

export async function POST(req: NextRequest, res: NextResponse) {
    // Get info about user authentication
    const token = await getToken({ req });

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
    const rooms = info.rooms;

    const body = await req.json();
    const messageID: Number = body["messageID"];
    const reactionType: number = Number(body["reaction"]);

    // Gets the message from the DB
    const messageInfoResult: any = await getAll(`SELECT * FROM messages WHERE id=$i`, {"$i": messageID});
    const messageInfo: any = messageInfoResult[0];

    // Checks that the user is in the room that the message is from
    if (!rooms.includes(messageInfo["roomID"])) {
        return NextResponse.json(
            { "error": "You are not in the room with that message" },
            { status: 403 }
        );
    }

    // Gets that specific reaction from the DB
    let reactions: any = [];
    let reactionName = "";

    /*
    Reaction types are as follows
    0: +1
    1: -1
    2: heart
    */
    if (reactionType === 0) {
        reactionName = "+1";
        reactions = messageInfo["+1"].split(",");
    } else if (reactionType === 1) {
        reactionName = "-1";
        reactions = messageInfo["-1"].split(",");
    } else if (reactionType === 2) {
        reactionName = "heart";
        reactions = messageInfo["heart"].split(",");
    } else {
        return NextResponse.json(
            { "error": "That is not a valid reaction"},
            { status: 400 }
        )
    }

    reactions.pop();

    // Modifies the reaction
    if (!reactions.includes(id.toString())) {
        // Adds the reaction to the array
        reactions.push(`${id}`);
        reactions = reactions.join(",") + ","
    } else {
        // removes the reaction from the array
        reactions.splice(reactions.indexOf(id), (id.toString.length + 1)).join(",");
        reactions = reactions + ","
    }

    // Updates the reaction
    const query = `UPDATE messages SET '${reactionName}'='${reactions}' WHERE id=${messageInfo.id};`;
    changeDB(query, {});

    // Updates the time the user was last active
    updateActivity(info.username);

    return NextResponse.json(
        { "success": true },
        { status: 200 }
    );
}