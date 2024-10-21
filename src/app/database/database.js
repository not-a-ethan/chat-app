const db =  require("./db.ts");

// Example query to fetch data from the database
const createTableQuery = `
  CREATE TABLE messages (
  id int,
  author int,
  content MEDIUMTEXT,
  plusOne int,
  minusOne int,
  heart int,
  tada int,
  roomID, int,
  create: TIMESTAMP,
  edit: TIMESTAMP
  )
`;

db.serialize(() => {
  db.run(createTableQuery, (err) => {
    if (err) {
      console.error('Error creating table:', err.message);
    } else {
      console.log('Table created successfully.');
    }
  });
});