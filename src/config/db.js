const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "supersorteos",
  password: "971977958#PostGres",
  port: 5432,
});

module.exports = pool;
