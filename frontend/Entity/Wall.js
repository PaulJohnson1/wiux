export default class Wall {
  constructor(game) {
    this.game = game;
  }

  parseBinary(reader, isCreation) {
    if (isCreation) {
        this.width = reader.vu();
        this.height = reader.vu();
        this.x = reader.vi();
        this.y = reader.vi();
    }
  }

  render(deltaTick) {
    this.game.ctx.save();
    this.game.ctx.fillStyle = "#7f7f7f7f";
    this.game.ctx.strokeStyle = "#7f7f7f57";
    this.game.ctx.lineWidth = 5 / this.game.fov;
    this.game.ctx.beginPath();
    this.game.ctx.rect(
        this.game.getSSX(this.x) - this.width / 2 / this.game.fov,
        this.game.getSSY(this.y) - this.height / 2 / this.game.fov,
        this.width / this.game.fov,
        this.height / this.game.fov
    )
    this.game.ctx.closePath();
    this.game.ctx.fill();
    this.game.ctx.stroke();
    this.game.ctx.restore();
  }
}
