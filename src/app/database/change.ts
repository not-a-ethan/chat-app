import { db } from "./db"

export function changeDB(query: String): boolean {
  db.serialize(() => {
      db.run(query, (err: {message: String}) => {
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