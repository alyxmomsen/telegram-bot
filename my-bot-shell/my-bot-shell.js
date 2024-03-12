const { Telegraf, Markup } = require("telegraf");
const { MongoClient } = require("mongodb");

// const Ticker
// const Ticker = require("../ticker");
const { current_token } = require("../src/bottoken");

const uri = "mongodb://localhost:27017";

class MyMongoClientShell extends MongoClient {
  isConnected;
  constructor(uri) {
    super(uri);
    this.isConnected = false;
  }
}

//

class MyTelegrafFramework {
  #bot;
  #client;
  #actions;

  #setMyBotCommands() {
    this.#bot.telegram.setMyCommands([
      { command: "start", description: "Start the bot" },
      { command: "help", description: `help me (in a little while)` },
    ]);
  }

  #connectToDatabase() {
    if (!this.#client.isConnected) {
      const db = this.client.db("mydatabase");
      const collectionUsers = db.collection("users");
      // bot.telegram.sendMessage('1547000037' , 'okay you connected');

      const isUserExists = collectionUsers.findOne({ id: userData.id });

      if (isUserExists) {
        console.log("yes it is");
      } else {
        console.log("no it is NOT");
      }
    }
  }

  // defineAction(action, handler) {
  //   this.#actions[action] = handler ;

  //   this.#bot.action();

  // }

  async launch() {
    const result = await this.#bot.launch();
  }

  constructor() {
    this.#actions;
    console.log("constructor getting start");
    this.#bot = new Telegraf(current_token);
    this.#client = new MyMongoClientShell(uri);
    this.#client.isConnected = false;
    this.#setMyBotCommands();

    this.#bot.start((ctx) => {
      ctx.reply(
        "hello. how are you",
        Markup.inlineKeyboard([
          Markup.button.callback("foo", "bar"),
          Markup.button.callback("baz", "foo"),
        ]),
      );

      // ctx.reply('hi' , Markup.keyboard([
      //   ['hello world' , 'hello there']
      // ]) );
    });

    /* const actions = {
      bar: (ctx) => {
        this.#bot.telegram.sendMessage("1547000037", "hello world");
      },
    };

    for (const action in actions) {
      this.#bot.action(action, actions[action]);
    } */

    this.#bot.action("bar", (ctx) => {
      ctx.reply("foo");
    });

    this.#bot.action("foo", (ctx) => {
      ctx.reply("barrrr");
    });

    this.#bot.hears("/help", (ctx) => {
      ctx.reply(`Of course, I'll help you in a little while`);
    });

    this.#bot.on("text", async (ctx) => {
      const userData = {
        id: ctx.from.id,
        firstName: ctx.from.username,
        lastName: ctx.from.last_name,
        text: ctx.message.text,
      };

      this.#connectToDatabase();

      if (this.#client.isConnected) {
        const database = this.#client.db("mydatabase");
        const usersCollection = database.collection("users");

        const cursor = usersCollection.find();
        const usersData = await cursor.toArray();

        if (usersData.length <= 0) {
          console.log("users data is empty");
        }
      }

      console.log("text has wrote and send");

      // ctx.reply('hello there');
    });

    console.log(`constructed`);
  }
}

module.exports = {
  MyTelegrafFramework
};
