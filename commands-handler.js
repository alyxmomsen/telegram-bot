/* const { connectToDatabase } = require("./connect-to-database");
const { defaultKeyboard } = require("./keyboards");

const commandsHandlers = {
  "/start": async (bot, chatID) => {
    bot.telegram.sendMessage(chatID, "alright , there is my menu: ", {
      reply_markup: {
        keyboard: defaultKeyboard,
      },
    });
  },
  home: async (bot, chatID) => {
    bot.telegram.sendMessage(chatID, "You already at home");
  },
  bye: async (bot, chatID) => {
    bot.telegram.sendMessage(chatID, "**ok, bye\\-bye\\!**", {
      parse_mode: "MarkdownV2",
      reply_markup: {
        remove_keyboard: true,
      },
    });
  },
  menu: async (bot, chatID) => {
    bot.telegram.sendMessage(chatID, "alright , there is my menu: ", {
      reply_markup: {
        keyboard: defaultKeyboard,
      },
    });
  },
  help: async (bot, chatID) => {
    bot.telegram.sendMessage(chatID, "||Of course I'll help you\\.||", {
      parse_mode: "MarkdownV2",
    });
  },
  button: async (bot, chatID) => {
    bot.telegram.sendMessage(chatID, "||Of course I'll help you\\.||", {
      reply_markup: {
        inline_keyboard: [
          [
            { text: "button-1", callback_data: "button1" },
            { text: "button-2", callback_data: "button2" },
          ],
        ],
      },
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
 */
