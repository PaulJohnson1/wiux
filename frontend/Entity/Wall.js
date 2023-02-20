const wallImage = new Image();
wallImage.src = "../Sprites/wall.png";

const wall = document.createElement("canvas");
const wallCtx = wall.getContext("2d");
let wallPattern = null;
wallImage.onload = () => wallPattern = wallCtx.createPattern(wallImage, "repeat");

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
    // this.game.ctx.fillStyle = "#7f7f7f7f";
    this.game.ctx.fillStyle = wallPattern;
    this.game.ctx.strokeStyle = "#7f7f7f57";
    this.game.ctx.lineWidth = 5 / this.game.fov;
    const xOffset = this.game.getSSX(0) % wallImage.width;
    const yOffset = this.game.getSSY(0) % wallImage.height;
    this.game.ctx.translate(xOffset, yOffset)
    this.game.ctx.beginPath();
    this.game.ctx.rect(
      this.game.getSSX(this.x) - this.width / 2 / this.game.fov - xOffset,
      this.game.getSSY(this.y) - this.height / 2 / this.game.fov - yOffset,
      this.width / this.game.fov,
      this.height / this.game.fov
    );
    this.game.ctx.fill();
    this.game.ctx.stroke();
    this.game.ctx.closePath();
    this.game.ctx.restore();
  }
}
