import { Writer } from "../Coder.js";

export default class Upgrade {
  constructor(game, x, y, name, max) {
    this.game = game;
    this.x = x;
    this.y = y;
    this.name = name;
    this.max = max;
    this.value = 0;
    this.baseWidth = 20;
    this.width = this.baseWidth;
    this.widthIncrement = 25;
    this.maxWidth = this.baseWidth + this.widthIncrement * max;
    this.height = 40;
    this.id = game.nextUpgradeId++;

    this.game.canvas.addEventListener("mousedown", ({ clientX, clientY }) => {
      clientX *= devicePixelRatio;
      clientY *= devicePixelRatio;

      if (
        clientX < this.x ||
        clientX > this.x + this.maxWidth ||
        clientY > this.y + this.height ||
        clientY < this.y
      ) return;

      const writer = new Writer();
      writer.vu(2);
      writer.vu(this.id);

      this.game.socket.send(writer.write());
    });

    if (this.id < 9) {
      const keyCode = "Digit" + (this.id + 1);
      document.addEventListener('keyup', (key) => {
        if (key.code === keyCode) {
          const writer = new Writer();
          writer.vu(2);
          writer.vu(this.id);

          this.game.socket.send(writer.write());
        }
      });
    }
  }

  render() {
    this.width = this.baseWidth + this.value * this.widthIncrement;
    
    this.game.ctx.save();
    this.game.ctx.beginPath();
    this.game.ctx.fillStyle = `hsla(${this.id * 30}, 100%, 50%, 20%)`;
    this.game.ctx.fillRoundRect(this.x / devicePixelRatio, this.y / devicePixelRatio, this.maxWidth / devicePixelRatio, this.height / devicePixelRatio, 6 / devicePixelRatio)
    this.game.ctx.closePath();
    this.game.ctx.restore();
    
    this.game.ctx.save();
    this.game.ctx.beginPath();
    this.game.ctx.fillStyle = `hsl(${this.id * 30}, 100%, 50%)`;
    this.game.ctx.strokeStyle = "#777";
    this.game.ctx.shadowColor = "#777";
    this.game.ctx.lineWidth = 2 / devicePixelRatio;
    this.game.ctx.shadowBlur = 10 / devicePixelRatio
    this.game.ctx.fillRoundRect(this.x / devicePixelRatio, this.y / devicePixelRatio, this.width / devicePixelRatio, this.height / devicePixelRatio, 6 / devicePixelRatio)
    this.game.ctx.closePath();
    this.game.ctx.stroke();
    this.game.ctx.restore();

    {
      this.game.ctx.save();
      this.game.ctx.beginPath();
      this.game.ctx.fillStyle = "#fff";
      this.game.ctx.strokeStyle = "#000";
      this.game.ctx.font = `${20 / devicePixelRatio}px Ubuntu`
      const x = (this.x + 10) / devicePixelRatio;
      const y = (this.y + this.height / 2 + 6) / devicePixelRatio;
      this.game.ctx.fillText(this.name, x, y);
      this.game.ctx.strokeText(this.name, x, y);
      this.game.ctx.closePath();
      this.game.ctx.restore();
    }

    {
      this.game.ctx.save();
      this.game.ctx.beginPath();
      this.game.ctx.fillStyle = "#fff";
      this.game.ctx.strokeStyle = "#000";
      const x = (this.maxWidth - 10) / devicePixelRatio;
      const y = (this.y + this.height / 2 + 8) / devicePixelRatio;
      this.game.ctx.font = `${25 / devicePixelRatio}px Ubuntu`;
      this.game.ctx.fillText(this.value, x, y);
      this.game.ctx.strokeText(this.value, x, y);
      this.game.ctx.closePath();
      this.game.ctx.restore();
    }

    // this.game.drawText({
    //   x: (this.maxWidth - 10) / devicePixelRatio,
    //   y: (this.y + this.height / 2 + 5) / devicePixelRatio,
    //   text: this.value,
    //   font: `${20 / devicePixelRatio}px Ubuntu`,
    //   color: "#000"
    // });
  }
}
