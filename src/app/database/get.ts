import database from "./db";

export function getInfo(query: string) {
    return database(query);
}