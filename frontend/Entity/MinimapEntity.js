export default class MinimapEntity {
  constructor(game) {
    this.game = game;
  }

  render() {
    this.game.ctx.save();
    this.game.ctx.fillStyle = `hsla(${this.color}, 100%, 50%, 60%)`;
    this.game.ctx.beginPath();
    this.game.ctx.arc(
      this.x / 127 * 100 / devicePixelRatio + 125 / devicePixelRatio,
      this.y / 127 * 100 / devicePixelRatio + innerHeight - 125 / devicePixelRatio,
      this.size / devicePixelRatio,
      0, Math.PI * 2);
    this.game.ctx.fill();
    this.game.ctx.closePath();
    this.game.ctx.restore();
  }
}
