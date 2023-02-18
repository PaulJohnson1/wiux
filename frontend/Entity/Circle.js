import { lerp } from "../util.js";

export default class Circle {
  constructor(game) {
    this.game = game;
    this.x = 0;
    this.x = 0;
    this.destinationX = 0;
    this.destinationY = 0;
  }

  parseBinary(reader, isCreation) {
    if (isCreation) {
      this.name = reader.string();
      this.style = reader.vu();
      this.color = reader.vu();
      this.alpha = 100;
    }

    this.destinationX = reader.vi();
    this.destinationY = reader.vi();
    this.destinationSize = reader.vu();
  }

  render(deltaTick) {
    if (this.x == null || this.y == null || this.size == null) {
      this.x = this.destinationX;
      this.y = this.destinationY;
      this.size = this.destinationSize;
    }

    this.x = lerp(this.x, this.destinationX, deltaTick)
    this.y = lerp(this.y, this.destinationY, deltaTick)
    this.size += (this.destinationSize - this.size) / 20;

    if (this.name)
    {
      this.game.ctx.save();
      this.game.ctx.beginPath();
      this.game.ctx.fillStyle = "#fff";
      this.game.ctx.strokeStyle = "#000";
      this.game.ctx.font = `bold ${50 / this.game.fov / devicePixelRatio}px Ubuntu`;
      const xOffset = this.game.ctx.measureText(this.name).width / 2;
      this.game.ctx.fillText(this.name, this.game.getSSX(this.x) - xOffset, this.game.getSSY(this.y) + this.size + 20 / this.game.fov / devicePixelRatio);
      this.game.ctx.strokeText(this.name, this.game.getSSX(this.x) - xOffset, this.game.getSSY(this.y) + this.size + 20 / this.game.fov / devicePixelRatio);
      this.game.ctx.closePath();
      this.game.ctx.restore();
    }

    if (this.style === 1)
    {
      let spikeCount = 10 + ((this.size - 15) / 135) * 25;
      const spikeTop = 10;
      const x = this.game.getSSX(this.x);
      const y = this.game.getSSY(this.y);

      let currentAngle = (Math.PI / 2) * 3;
      let spikeAngle = Math.PI / spikeCount;
      const r = this.size / this.game.fov / devicePixelRatio;

      this.game.ctx.save();
      this.game.ctx.fillStyle = `hsl(${this.color}, 100%, 50%)`;
      this.game.ctx.strokeStyle = `hsl(${this.color}, 100%, 40%)`;
      this.game.ctx.shadowColor = `hsl(${this.color}, 100%, 50%)`;
      this.game.ctx.lineWidth = 5 / this.game.fov / devicePixelRatio;
      this.game.ctx.beginPath();
      this.game.ctx.moveTo(x, y - spikeTop + r)
      for (let i = 0; i < spikeCount; i++) {
        this.game.ctx.lineTo(
          x + Math.cos(currentAngle) * (spikeTop + r),
          y + Math.sin(currentAngle) * (spikeTop + r)
        );
        currentAngle += spikeAngle;
        this.game.ctx.lineTo(
          x + Math.cos(currentAngle) * r,
          y + Math.sin(currentAngle) * r
        );
        currentAngle += spikeAngle;
      }
      this.game.ctx.closePath();
      this.game.ctx.fill();
      this.game.ctx.stroke();
      this.game.ctx.restore();
    }

    this.game.ctx.save();
    this.game.ctx.fillStyle = `hsl(${this.color}, 100%, ${this.style === 1 ? "40%" : "50%"})`;
    this.game.ctx.shadowColor = `hsl(${this.color}, 100%, 50%)`;
    this.game.ctx.strokeStyle = `hsl(${this.color}, 100%, 40%)`;
    this.game.ctx.lineWidth = 5 / this.game.fov / devicePixelRatio;
    this.game.ctx.beginPath();
    this.game.ctx.arc(this.game.getSSX(this.x), this.game.getSSY(this.y), this.size / this.game.fov / devicePixelRatio, 0, Math.PI * 2);
    this.game.ctx.fill();
    if (this.style !== 1)
      this.game.ctx.stroke();
    this.game.ctx.closePath();
    this.game.ctx.restore();
  }
}
