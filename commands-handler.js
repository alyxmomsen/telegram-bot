const { connectToDatabase } = require("./connect-to-database");
const { defaultKeyboard } = require("./keyboards");

const commandsHandlers = {
  "/start": async (bot, chatID) => {
    bot.telegram.sendMessage(chatID, "alright , there is my menu: ", {
      reply_markup: {
        keyboard: defaultKeyboard,
      },
    });
  },
  "/home": async () => {},
  "/exit": async () => {},
  "/menu": async () => {},
  "/help": async () => {},
  // "/getdata": async (ctx) => {
  //   const user = {
  //       id: ctx.from.id,
  //       username: ctx.from.username,
  //       firstName: ctx.from.first_name,
  //       lastName: ctx.from.last_name,
  //     };
  //     // Подключение к базе данных
  //     await connectToDatabase(DBClient);
  //     if (DBClient.isConnected) {
  //       const database = DBClient.db("mydatabase"); // Замените на имя вашей базы данных
  //       const collection = database.collection("mycollection"); // Замените на имя вашей коллекции

  //       // Сохранение данных пользователя и текста сообщения в базе данных
  //       const result = await collection.insertOne({ user, message });
  //       console.log("Данные успешно добавлены:", result.insertedId);

  //       ctx.reply("Данные успешно сохранены в базе данных.");
  //     } else {
  //       ctx.reply(
  //         "Ошибка при подключении к базе данных. Пожалуйста, попробуйте позже.",
  //       );
  //     }
  // } ,
};

const commandManager = async (command, bot, chatID, DBClient) => {
  if (commandsHandlers.hasOwnProperty(message)) {
    const command = message;
    commandsHandlers[command](bot, chatID);
  } else {
    bot.telegram.sendMessage(chatID, "unknown command , sorry");
  }
};

module.exports = {
  commandsHandlers,
};
