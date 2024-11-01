function getInfo(query: String) {
    db.all(query, (err: {message: String}, rows: any) => {
        if (err) {
          console.error('Error fetching data:', err.message);
        } else {
          return rows;
        }
      });
}