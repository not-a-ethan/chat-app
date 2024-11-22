import { getAll } from "@/app/database/get";

export async function accountExists(type: string, provider: string, ssoID: Number) {    
    let query;
    if (type === "sso") {
        query = `SELECT * FROM users WHERE externalID=${ssoID} AND sso_pro=${provider};`
    } else if (type === "credentials") {
        query = `SELECT * FROM users WHERE username=${provider};`
    } else {
        return null;
    }

    interface userType {
        id: Number,
        name: String | null,
        username: String,
        password: String | null,
        sso_pro: String | null,
        externalID: Number | null,
        '2FA': String | null;
        passkey: String | null;
        rooms: String | null;
    }

    const user: readonly userType[] = await getAll(query) as unknown as readonly userType[];

    if (user.length > 0) {
        return true;
    }

    return false;
}