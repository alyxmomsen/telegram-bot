const { Telegraf, Markup } = require("telegraf");
const { MongoClient } = require("mongodb");
const {
  firstKeyboard,
  defaultKeyboard,
  defaultCommands,
} = require("./keyboards");
const { setMyCommands } = require("./myBotLib");
const { getMongoData } = require("./my-mongo-db-lib");
const { connectToDatabase } = require("./connect-to-database");
const { current_token } = require("./bottoken");
const { commandsHandlers } = require("./commands-handler");
const Ticker = require("./ticker");
class MongoClientExt extends MongoClient {
  isConnected;
  constructor(uri) {
    super(uri);
    this.isConnected = false;
  }
}

const ticker = new Ticker();
console.log(ticker);

// Создание экземпляра бота
const bot = new Telegraf(current_token);
// const bot = new TelegrafExt("7060342495:AAE-XsTxfpv5xR8ZX_5Hc0bIzjKKrAz5FKg");

// Подключение к базе данных
const uri = "mongodb://localhost:27017"; // Замените на URI вашей базы данных
const client = new MongoClientExt(uri);
client.isConnected = false;

setMyCommands(bot, defaultCommands);

bot.on("text", async (ctx) => {
  const message = ctx.message.text;
  const chatID = ctx.message.chat.id;

  if (ticker.tick()) {
    console.log("tick");
  }

  await connectToDatabase(client);

  // Получение данных о пользователе
  const user = {
    id: ctx.from.id,
    username: ctx.from.username,
    firstName: ctx.from.first_name,
    lastName: ctx.from.last_name,
  };

  if (client.isConnected) {
    const database = client.db("mydatabase"); // Замените на имя вашей базы данных
    const usersCollection = database.collection("users"); // Замените на имя вашей коллекции

    const isExistsUser = await usersCollection.findOne({ id: user.id });

    if (isExistsUser) {
      console.log("this same user exists");
      const result = await usersCollection.updateOne(
        { id: user.id },
        {
          $push: {
            activity: {
              timestamp: ctx.message.date,
              message: ctx.message.text,
            },
          },
        },
      );

      console.log(await usersCollection.findOne({ id: user.id }));
      // console.log(result);
    } else {
      usersCollection.insertOne({
        id: user.id,
        activity: [{ timestamp: ctx.message.date, message: ctx.message.text }],
      });
    }

  } else {
    ctx.reply("Error connecting to the database. Please try again later.");
  }

  if (message === "/deletethefuckingdata") {
    await connectToDatabase(client);

    if (client.isConnected) {
      const db = client.db("mydatabase");
      const usersCollection = db.collection("users");

      const cursor = usersCollection.find();
      const mongodata = await cursor.toArray();

      console.log("mongo data", mongodata);

      try {
        const deleteResult = await usersCollection.deleteMany(
          {},
          (err, result) => {
            if (err) {
              console.error("Ошибка при удалении данных:", err);
              return;
            }

            console.log("Успешно удалены все данные из базы данных.");
            client.close(); // Закрытие соединения с базой данных
          },
        );

        console.log(deleteResult);
      } catch (err) {
        console.log(err);
      }
    } else {
      console.log("sorry, no connection");
    }
  }

  if (commandsHandlers.hasOwnProperty(message)) {
    const command = message;
    commandsHandlers[command](bot, chatID);
  } else {
    bot.telegram.sendMessage(chatID, "unknown command , sorry");
  }
});

// Запуск бота
bot.launch();
