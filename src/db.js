const knex = require("knex");

const connectedKnex = knex({
  client: "sqlite3",
  connection: {
    filename: "death.sqlite3",
  },
});

module.exports = connectedKnex;
