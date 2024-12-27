import { updateActivity } from "./updateActivity";
import { changeDB } from "@/app/database/change";

export function createAccount(type: string, username: string, password: string|null, sso_pro: string|null, sso_id: number|null): boolean {
    let query;
    if (type === "sso") {
        query = `INSERT INTO users (username, sso_pro, externalID) VALUES ('${username}', '${sso_pro}', ${sso_id});`
    } else if (type === "credentials") {
        query = `INSERT INTO users (username, password) VALUES ('${username}', '${password}');`
    } else {
        return false;
    }

    const user: boolean = changeDB(query, {});

    updateActivity(username)

    return user;
}