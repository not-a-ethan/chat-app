import { accountExists } from "./accountExists";
import { changeDB } from "@/app/database/change";

export async function updateActivity(username: string) {
    const time = Date.now();

    const query = "UPDATE users set recentlyActive=$time WHERE username=$username";

    const response = await changeDB(query, {"$time": time, "$username": username});

    return response;
}