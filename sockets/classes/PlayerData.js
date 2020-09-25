// use uuid module to create a massive random string to id this player
const uuidv4 = require("uuid/v4");

// This is where all the data that EVERYONE needs to know about
class PlayerData {
  constructor(playerName, settings) {
    this.uid = uuidv4();
    this.name = playerName;
    this.locX = Math.floor(settings.worldWidth * Math.random());
    this.locY = Math.floor(settings.worldHeight * Math.random());
    this.radius = settings.defaultSize;
    this.color = this.getRandomColor();
    this.score = 0;
    this.orbsAbsorbed = 0;
  }
  getRandomColor() {
    const r = Math.floor(200 * Math.random() + 50);
    const g = Math.floor(200 * Math.random() + 50);
    const b = Math.floor(200 * Math.random() + 50);
    return `rgb(${r},${g},${b})`;
  }
}

module.exports = PlayerData;
