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

    const isExistsUser = usersCollection.findOne({ id: user.id });

    if (isExistsUser) {
      usersCollection.updateOne(
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
    } else {
      usersCollection.insertOne({
        id: user.id,
        activity: { timestamp: ctx.message.date, message: ctx.message.text },
      });
    }

    // Сохранение данных пользователя и текста сообщения в базе данных
    const result = await usersCollection.insertOne({ user, message });
    console.log("Данные успешно добавлены:", result.insertedId);

    await bot.telegram.sendMessage(
      chatID,
      "he data has been successfully saved in the database. Thanks.",
    );

    // ctx.reply("The data has been successfully saved in the database. Thanks.");
  } else {
    ctx.reply("Error connecting to the database. Please try again later.");
  }

  if (message === "/deletethefuckingdata") {
    await connectToDatabase(client);

    if (client.isConnected) {
      const db = client.db("mydatabase");
      const collection = db.collection("mycollection");

      const cursor = collection.find();
      const mongodata = await cursor.toArray();

      console.log("mongo data", mongodata);

      try {
        const deleteResult = await collection.deleteMany({}, (err, result) => {
          if (err) {
            console.error("Ошибка при удалении данных:", err);
            return;
          }

          console.log("Успешно удалены все данные из базы данных.");
          client.close(); // Закрытие соединения с базой данных
        });

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

// Обработка текстовых сообщений
/* bot.on("text", async (ctx) => {
  const message = ctx.message.text;
  const chatID = ctx.message.chat.id;

  await connectToDatabase(client);

  if (client.isConnected) {
    switch (message) {
      case "/continue":
        bot.telegram.sendMessage(chatID, "alright , there is my menu: ", {
          reply_markup: {
            keyboard: defaultKeyboard,
          },
        });
        break;
      case "/world":
        bot.telegram.sendMessage(chatID, "hello hello");
        break;
      case "/hello":
        bot.telegram.sendMessage(chatID, "WORLD");
        break;
      case "/start":
          bot.telegram.sendMessage(chatID, "bot just started", {
            reply_markup: {
              keyboard: firstKeyboard,
            },
          });

        break;
      case "/getdata":
        // await connectToDatabase();

        if (client.isConnected) {
          
          const theData = await getMongoData(client);

          if (theData) {
            console.log(theData);
          } else {
            console.log("nothing to display");
          }

        } else {
          ctx.reply(
            "Error connecting to the database. Please try again later.",
          );
        }
        break;
      case "/home":
        break;
      case "/exit":
        break;
      case "/menu":
        await bot.telegram.sendMessage(
          ctx.message.chat.id.toString(),
          `Меню бота`,
          {
            reply_markup: {
              keyboard: defaultKeyboard,
            },
          },
        );

        break;
      case "/help":
        await bot.telegram.sendMessage(
          ctx.message.chat.id.toString(),
          "Раздел помощи Markdown\n\n*Жирный Текст*\n_Текст Курсивом_\n`Текст с Копированием`\n~Перечеркнутый текст~\n``` код ```\n||скрытый текст||\n[Гиперссылка](t.me)",
          {
            parse_mode: "MarkdownV2",
          },
        );
        break;
      case "/setdata":
        // Получение данных о пользователе
        const user = {
          id: ctx.from.id,
          username: ctx.from.username,
          firstName: ctx.from.first_name,
          lastName: ctx.from.last_name,
        };
        // Подключение к базе данных
        await connectToDatabase(client);
        if (client.isConnected) {
          const database = client.db("mydatabase"); // Замените на имя вашей базы данных
          const collection = database.collection("mycollection"); // Замените на имя вашей коллекции

          // Сохранение данных пользователя и текста сообщения в базе данных
          const result = await collection.insertOne({ user, message });
          console.log("Данные успешно добавлены:", result.insertedId);

          ctx.reply("Данные успешно сохранены в базе данных.");
        } else {
          ctx.reply(
            "Ошибка при подключении к базе данных. Пожалуйста, попробуйте позже.",
          );
        }
    }
  }
}); */

// Запуск бота
bot.launch();
