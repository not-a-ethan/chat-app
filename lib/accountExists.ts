import { getInfo } from "@/app/database/get";

function accountExists(type: string, username: string, ssoID: number) {
    let query;
    if (type === "sso") {
        query = `SELECT * FROM users WHERE externalID = ${ssoID};`
    } else if (type === "username") {
        query = `SELECT * FROM users WHERE username = ${username};`
    } else {
        return null;
    }

    console.log("\n\nThis is the response from the DB [/lib/accountExists.ts line 17]")

    const response = getInfo(query);
    console.log(response);

    return response;
}

export { accountExists };