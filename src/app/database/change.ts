function changeDB(query: String) {
    db.serialize(() => {
        db.run(query, (err: {message: String}) => {
          if (err) {
            console.error('Error creating table:', err.message);
            return false;
          } else {
            return true
          }
        });
      });
}