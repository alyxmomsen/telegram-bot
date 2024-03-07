module.exports = {
  firstKeyboard: [["/continue", "/exit"]],
  defaultKeyboard: [
    ["/hello", "/world"],
    ["/foo", "/bar", "/baz"],
    ["/home", "/close"],
    ["/setdata"],
  ],
  defaultCommands: [
    {
      command: "start",
      description: "Запуск бота",
    },
    {
      command: "getdata",
      description: "get data",
    },
    {
      command: "help",
      description: "get help",
    },
    {
      command: "home",
      description: "go home",
    },
    {
      command: "exit",
      description: "get exit",
    },
    {
      command: "menu",
      description: "display the menu",
    },
  ],
};
