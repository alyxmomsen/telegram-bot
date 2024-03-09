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
  "/bye": async (bot , chatID) => {
    bot.telegram.sendMessage(chatID , "ok, bye-bye!" , {
      reply_markup: {
        remove_keyboard:true ,
      }
    });
  },
  "/menu": async () => {},
  "/help": async (bot, chatID) => {
    bot.telegram.sendMessage(chatID, "||Of course I'll help you\\.||", {
      parse_mode: "MarkdownV2",
    });
  },
  
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
