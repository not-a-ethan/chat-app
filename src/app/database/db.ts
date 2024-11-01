const sqlite3 = require('sqlite3').verbose();

const dbPath = '../../database/database.db'; // give path to database

// Create a new SQLite database instance
const db = new sqlite3.Database(dbPath, (err: { message: any; }) => {
  if (err) {
    console.error('Error connecting to the database:', err.message);
  } else {
    console.log('Connected to the database.');
  }
});

// Export the configured database connection for use in other parts of your application
//export default db;
module.exports = db;