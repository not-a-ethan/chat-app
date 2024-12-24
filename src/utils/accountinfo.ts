import { getAll } from "@/app/database/get";

export default async function accountInfo(token: any) {
    const userObj = {
        username: '',
        id: -1,
        type: "credentials"
    };

    if (token.sub) {
        const externalID = token.sub;
        const username = await getAll(`SELECT * FROM users WHERE externalID=${externalID}`);
        
        userObj.username = username[0].username;
        userObj.type = "sso";
    } else {
        userObj.username = token.email;
    }

    return userObj;
};