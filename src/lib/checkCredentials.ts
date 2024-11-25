import bcrypt from "bcrypt";

import { accountExists } from "./accountExists";
import { getAll } from "@/app/database/get";

export async function checkCredentials(username: String, password: String): Promise<boolean> {
    const exists = await accountExists("credentials", username, -1);

    if (!exists) {
        return false;
    } else {
        const query = `SELECT * FROM users WHERE username='${username}';`

        const dbResult: String = await getAll(query);
        const hash: String = dbResult[0]["password"];

        const correct = await bcrypt.compare(password, hash);

        return correct;
    }

    return false;
}