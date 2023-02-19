export default class MinimapEntity {
  constructor(game) {
    this.game = game;
  }

  render() {
    this.game.ctx.save();
    this.game.ctx.beginPath();
    if (this.isWall)
    {
      this.game.ctx.fillStyle = "#7f7f7f7f"
      this.game.ctx.rect(
        this.x / 127 * 100 + 125 - this.width / 2,
        this.y / 127 * 100 + innerHeight - 125 - this.height / 2,
        this.width,
        this.height
      );
    }
    else
    {
      this.game.ctx.fillStyle = `hsla(${this.color}, 100%, 50%, 60%)`;
      this.game.ctx.arc(
        this.x / 127 * 100 + 125,
        this.y / 127 * 100 + innerHeight - 125,
        this.size,
        0, Math.PI * 2
      );
    }
    this.game.ctx.fill();
    this.game.ctx.closePath();
    this.game.ctx.restore();
  }
}
