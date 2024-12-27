import { getAll } from "@/app/database/get"
import { changeDB } from "@/app/database/change"

export async function addUser(roomID: Number, username: String) {
    const sqlCurrentRooms = await getAll(`SELECT rooms FROM users WHERE username=$username`, {"$username": username});
    const currentRooms = sqlCurrentRooms[0]["rooms"];
    const newRooms = `${currentRooms}${roomID},`;

    const query = `UPDATE users SET rooms=$rooms WHERE username=$username`;
    const result = await changeDB(query, {"$rooms": newRooms, "$username": username})

    return result;
}