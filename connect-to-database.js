module.exports = {
  connectToDatabase: async function (client) {
    if (!client.isConnected) {
      try {
        await client.connect();
        client.isConnected = true;
        console.log("The connection to the database is established");
      } catch (error) {
        console.error("Error connecting to the database:", error);
      }
    }
  },
};
