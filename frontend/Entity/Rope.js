import RopeSegment from "./RopeSegment.js";
import { lerp } from "../util.js";

export default class Rope {
  constructor(game) {
    this.game = game;
    this.segments = [];
    this.length = 0;
  }

  parseBinary(reader, isCreation) {
    if (isCreation) {
      this.length = reader.vu();
    }

    for (let i = 0; i < this.length; i++) {
      if (isCreation) this.segments[i] = new RopeSegment(this.game);

      const segment = this.segments[i]
      segment.destinationX = reader.vi();
      segment.destinationY = reader.vi();
    
      if (segment.startX == null || segment.startY == null)
      {
        segment.startX = segment.destinationX;
        segment.startY = segment.destinationY;
      }
    }
  }

  render(deltaTick) {
    for (let i = 0; i < this.length; i++)
    {
      const segment = this.segments[i];

      segment.x = lerp(segment.startX, segment.destinationX, deltaTick)
      segment.y = lerp(segment.startY, segment.destinationY, deltaTick)

      segment.startX = segment.x;
      segment.startY = segment.y;
    }

    this.game.ctx.save();
    this.game.ctx.beginPath();
    this.game.ctx.strokeStyle = "#888";
    this.game.ctx.lineWidth = 2;
    for (let i = 1; i < this.length; i++) {
      const a = this.segments[i - 1];
      const b = this.segments[i];

      this.game.ctx.moveTo(this.game.getSSX(a.x), this.game.getSSY(a.y));
      this.game.ctx.lineTo(this.game.getSSX(b.x), this.game.getSSY(b.y));
    }
    this.game.ctx.closePath();
    this.game.ctx.stroke();
    this.game.ctx.restore();
  }
}
