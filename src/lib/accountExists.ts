import { getAll } from "@/app/database/get";

export async function accountExists(type: string, provider: string, ssoID: number) {    
    let query;
    if (type === "sso") {
        query = `SELECT * FROM users WHERE externalID=${ssoID} AND sso_pro='${provider}';`
    } else if (type === "credentials") {
        query = `SELECT * FROM users WHERE username='${provider}';`
    } else {
        return null;
    }

    interface userType {
        id: number,
        name: string | null,
        username: string,
        password: string | null,
        sso_pro: string | null,
        externalID: number | null,
        '2FA': string | null;
        passkey: string | null;
        rooms: string | null;
    };

    const user: readonly userType[] = await getAll(query) as unknown as readonly userType[];

    if (user.length > 0) {
        return true;
    };

    return false;
};