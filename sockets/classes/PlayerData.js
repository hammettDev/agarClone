// This is where all the data that EVERYONE needs to know about
class PlayerData {
  constructor(playerName, settings) {
    this.name = playerName;
    this.locX = Math.floor(settings.worldWidth * Math.random() + 10);
    this.locY = Math.floor(settings.worldHeight * Math.random() + 10);
    this.radius = settings.defaultSize;
    this.color = this.getRandomColor();
    this.score = 0;
  }
  getRandomColor() {
    const r = Math.floor(200 * Math.random() + 50);
    const g = Math.floor(200 * Math.random() + 50);
    const b = Math.floor(200 * Math.random() + 50);
    return `rgb(${r},${g},${b})`;
  }
}

module.exports = PlayerData;
