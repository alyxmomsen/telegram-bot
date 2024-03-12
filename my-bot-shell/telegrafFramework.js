const { Telegraf, Markup } = require("telegraf");
const { MongoClient } = require("mongodb");

const Ticker = require("../ticker");

class TelegrafFramework {
  constructor(token, databaseUri) {
    this.bot = new Telegraf(token);
    this.dbClient = new MongoClient(databaseUri);
    this.db = null;
    this.commandHandlers = {};
    this.eventHandlers = {};
    this.isDataBaseConnected = false;

    //...
  }

  // Метод для подключения к базе данных
  async connectToDatabase() {
    if (!this.isDataBaseConnected) {
      try {
        await this.dbClient.connect();
        this.db = this.dbClient.db("mydatabase");
        console.log("Connected to the database");
      } catch (error) {
        console.error("Failed to connect to the database:", error);
      }
    }
  }

  // Метод для добавления обработчиков команд
  addCommandHandler(command, handler) {
    this.commandHandlers[command] = handler;
  }

  // Метод для добавления обработчиков событий
  addEventHandler(event, handler) {
    if (!this.eventHandlers[event]) {
      this.eventHandlers[event] = [];
    }
    this.eventHandlers[event].push(handler);
  }

  // Метод для выполнения обработчиков команд
  executeCommandHandlers(command, ctx) {
    if (this.commandHandlers[command]) {
      this.commandHandlers[command](ctx);
    }
  }

  // Метод для выполнения обработчиков событий
  executeEventHandlers(event, ctx) {
    if (this.eventHandlers[event]) {
      this.eventHandlers[event].forEach((handler) => handler(ctx));
    }
  }

  // Метод для запуска бота
  launch() {
    this.bot.launch();
  }
}

// module.exports = TelegrafFramework;
