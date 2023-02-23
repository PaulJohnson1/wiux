import Vector from "../Vector.js";
import { lerp } from "../util.js";

export default class Sentinel {
    constructor(game) {
        this.game = game;
        this.x = null;
        this.y = null;
        this.angle = null;
        this.velocityX = null;
        this.velocityY = null;
        this.destinationX = 0;
        this.destinationY = 0;
        this.destinationVelocityX = 0;
        this.destinationVelocityY = 0;
    }

    parseBinary(reader, isCreation)
    {
        this.destinationX = reader.vi();
        this.destinationY = reader.vi();
        this.destinationVelocityX = reader.float();
        this.destinationVelocityY = reader.float();
    }

    render(deltaTick)
    {
        if (this.x == null) {
            this.x = this.destinationX;
            this.y = this.destinationY;
            this.velocityX = this.destinationVelocityX;
            this.velocityY = this.destinationVelocityY;
        }

        this.x = lerp(this.x, this.destinationX, deltaTick);
        this.y = lerp(this.y, this.destinationY, deltaTick);
        this.velocityX = lerp(this.velocityX, this.destinationVelocityX, deltaTick);
        this.velocityY = lerp(this.velocityY, this.destinationVelocityY, deltaTick);
        this.angle = Math.atan2(this.velocityY, this.velocityX);

        this.game.ctx.save();
        this.game.ctx.beginPath();
        this.game.ctx.fillStyle = "#9CFF2E";
        this.game.ctx.strokeStyle = "#38E54D";
        this.game.ctx.translate(this.game.getSSX(this.x), this.game.getSSY(this.y))
        this.game.ctx.rotate(this.angle + Math.PI / 2);
        const scalingFactor = Math.sqrt(this.velocityX * this.velocityX + this.velocityY * this.velocityY);
        this.game.ctx.scale(1 / scalingFactor / 40 + 1 / this.game.fov, scalingFactor / 20 + 0.5 / this.game.fov);
        this.game.ctx.filter = "blur(4px)";
        this.game.ctx.lineWidth = 4
        this.game.ctx.moveTo(0, 0);
        this.game.ctx.lineTo(-20, -20);
        this.game.ctx.lineTo(20, -20);
        this.game.ctx.lineTo(0, 0);
        this.game.ctx.closePath();
        this.game.ctx.fill();
        this.game.ctx.stroke();
        this.game.ctx.restore();
    }
}
