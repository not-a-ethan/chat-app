import { db } from "./db"

export function changeDB(query: String, parms: any): boolean {
  db.serialize(() => {
      db.run(query, parms, (err: {message: String}) => {
        if (err) {
          console.error('Error proforming query:', err.message);
          return false;
        } else {
          return true
        }
      });
    });
    return false;
}