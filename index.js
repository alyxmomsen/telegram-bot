// const MyBotShell = require("./my-bot-shell/my-bot-shell");

const { MyTelegrafFramework } = require("./my-bot-shell/my-bot-shell");
// const { current_token } = require("../src/bottoken");
// const uri = "mongodb://localhost:27017";

const bot = new MyTelegrafFramework();

bot.launch();

// const bot = new TelegrafFramework(current_token, uri);

// bot.addEventHandler("hears", (ctx) => {});

// bot.launch();
