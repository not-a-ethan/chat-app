import { db } from "./db";

export function changeDB(query: string, parms: any): boolean {
  db.serialize(() => {
      db.run(query, parms, (err: {message: string}) => {
        if (err) {
          console.error('Error proforming query:', err.message);
          return false;
        } else {
          return true;
        }
      });
    });
    
    return true;
}