let knex;

try {
  knex = require("knex")({
    client: process.env.DB_CLIENT,
    connection: {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    },
    pool: {
      min: 2,
      max: 10
    }
  });

  knex
    .raw("SELECT 1")
    .then(() => {
      console.log("MySQL Database connected");
    })
    .catch(error => {
      console.error("Error connecting to the database:", error);
    });
} catch (error) {
  console.error("Error connecting to the database:", error);
}

module.exports = knex;
