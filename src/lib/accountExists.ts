import { getAll } from "@/app/database/get";

export async function accountExists(type: string, username: string, ssoID: number) {    
    let query;
    if (type === "sso") {
        query = `SELECT * FROM users WHERE externalID=${ssoID};`
    } else if (type === "username") {
        query = `SELECT * FROM users WHERE username=${username};`
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