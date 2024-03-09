class Ticker {
  lastTick;

  tick() {
    const time = Date.now();
    const difference = time - this.lastTick;

    if (difference >= 10000) {
      this.lastTick = time;
      return true;
    } else {
      return false;
    }
  }

  constructor() {
    this.lastTick = 0;
  }
}

module.exports = Ticker;
