import mysql from 'mysql2';

const db = mysql.createConnection({
  host: 'localhost', // Or your MySQL server address
  user: 'your-username', // Your MySQL username
  password: 'your-password', // Your MySQL password
  database: 'lebanese_crisis_support', // Your database name
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err.stack);
    return;
  }
  console.log('Connected to MySQL as id ' + db.threadId);
});

export default db;
