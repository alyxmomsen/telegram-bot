const { connectToDatabase } = require("./connect-to-database");

module.exports = {};

const user = {
  id: ctx.from.id,
  username: ctx.from.username,
  firstName: ctx.from.first_name,
  lastName: ctx.from.last_name,
};

await connectToDatabase(client);
