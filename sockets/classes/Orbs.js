class Orb {
  constructor() {
    this.color = this.getRandomColor();
    this.locX = Math.floor(500 * Math.random());
    this.locY = Math.floor(500 * Math.random());
    this.radius = 5;
  }
  getRandomColor() {
    const r = Math.floor(200 * Math.random() + 50);
    const g = Math.floor(200 * Math.random() + 50);
    const b = Math.floor(200 * Math.random() + 50);
    return `rgb(${r},${g},${b})`;
  }
}

module.exports = Orb;
