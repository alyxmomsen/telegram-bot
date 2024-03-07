const { connectToDatabase } = require("./connect-to-database");
// import { connectToDatabase } from "./connect-to-database";

module.exports = {
  getMongoData: async function (client) {
    await connectToDatabase(client);

    if (client.isConnected) {
      console.log("Connection is ON");
      const database = client.db("mydatabase"); // Замените на имя вашей базы данных
      const collection = database.collection("mycollection"); // Замените на имя вашей коллекции

      const cursor = collection.find();
      const mongoData = await cursor.toArray();

      if (mongoData.length) {
        return mongoData;
      } else {
        return null;
      }
    } else {
      console.log("NO CONNECTION");
      return null;
    }
  },
};
