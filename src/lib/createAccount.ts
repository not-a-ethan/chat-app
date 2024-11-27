import { accountExists } from "./accountExists";
import { changeDB } from "@/app/database/change";

export function createAccount(type: String, username: String, password: String|null, sso_pro: String|null, sso_id: Number|null): boolean {
    let query;
    if (type === "sso") {
        query = `INSERT INTO users (username, sso_pro, externalID) VALUES ('${username}', '${sso_pro}', ${sso_id});`
    } else if (type === "credentials") {
        query = `INSERT INTO users (username, password) VALUES ('${username}', '${password}');`
    } else {
        return false;
    }

    const user: boolean = changeDB(query);

    return user;
}