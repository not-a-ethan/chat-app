import bcrypt from "bcrypt";

import { accountExists } from "./accountExists";
import { getAll } from "@/app/database/get";

import { updateActivity } from "./updateActivity";

export async function checkCredentials(username: string, password: string): Promise<boolean> {
    const exists = await accountExists("credentials", username, -1);

    if (!exists) {
        return false;
    } else {
        const query = `SELECT * FROM users WHERE username='${username}';`

        const dbResult: string = await getAll(query);
        const hash: string = dbResult[0]["password"];

        const correct = await bcrypt.compare(password, hash);

        if (correct) {
            updateActivity(username);
        }

        return correct;
    }
}