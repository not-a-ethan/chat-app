import { getAll } from "@/app/database/get";

export default async function accountInfo(token: any) {
    const userObj = {
        username: '',
        id: -1,
        type: "credentials",
        rooms: [],
        recentlyActive: -1
    };

    if (token.sub) {
        const externalID = token.sub;
        const username = await getAll(`SELECT * FROM users WHERE externalID=${externalID}`);
        
        userObj.username = username[0].username;
        userObj.type = "sso";
    } else {
        userObj.username = token.email;
    }

    const userInfoResult = await getAll(`SELECT * FROM users WHERE username='${userObj.username}'`);
    const userInfo = userInfoResult[0];

    userObj.id = userInfo["id"];
    userObj.rooms = userInfo["rooms"];
    userObj.recentlyActive = userInfo["recentlyActive"];

    return userObj;
};