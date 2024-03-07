const { Telegraf } = require("telegraf");
const { MongoClient } = require("mongodb");

// Создание экземпляра бота
const bot = new Telegraf("7060342495:AAHjPYNtXvk0tn0ACm0lX3ecz5JzF3ojAcI");

// Подключение к базе данных
const uri = "mongodb://localhost:27017"; // Замените на URI вашей базы данных
const client = new MongoClient(uri);
let isConnected = false;

async function connectToDatabase() {
  if (!isConnected) {
    try {
      await client.connect();
      isConnected = true;
      console.log("Подключение к базе данных установлено");
    } catch (error) {
      console.error("Ошибка при подключении к базе данных:", error);
    }
  }
}

// Обработка команды /start
bot.start(async (ctx) => {
  ctx.reply("Привет! Что вы хотите от меня?");

  console.log("foo");
  await connectToDatabase();

  if (isConnected) {
    const database = client.db("mydatabase"); // Замените на имя вашей базы данных
    const collection = database.collection("mycollection"); // Замените на имя вашей коллекции

    // Выполнение операций с базой данных
    const result = await collection.insertOne({ name: "John Doe", age: 30 });
    console.log("Документ успешно добавлен:", result.insertedId);
  }
});

bot.launch();
console.log("foo bar");
