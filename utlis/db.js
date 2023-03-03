const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  database: 'node_project',
  password: '',
});
module.exports=pool.promise();