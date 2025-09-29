import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'srv1951.hstgr.io',
  user: 'u999765516_cognizium',
  password: 'Y0@BI9l6Ytlp',
  database: 'u999765516_cognizium',
});

// const pool = mysql.createPool({
//   host: 'localhost',
//   user: "root",
//   password: "",
//   database: "eventpro",
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0
//   });

export default pool;
