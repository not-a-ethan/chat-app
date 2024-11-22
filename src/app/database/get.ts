import sqlite3 from 'sqlite3';
const sqlite = sqlite3.verbose();
import { db } from "./db";

export const getAll: any = async (query: string, params: any) => {
    return new Promise((resolve, reject) => {
        db.all(query, params, (err: any, row: any) => {
        if (err) reject(err);
        resolve(row);
        });
    });
}