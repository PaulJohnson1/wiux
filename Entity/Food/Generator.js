"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseEntity_1 = require("../BaseEntity");
const Food_1 = require("./Food");
const Flail_1 = require("../Player/Flail");
const Player_1 = require("../Player/Player");
class Generator extends BaseEntity_1.default {
    constructor(game) {
        super(game);
        this.animationSizeAddon = 0;
        this.canShootFood = true;
        this.lastHitTick = 0;
        this.hitCooldown = 10;
        this.knockback = 5;
        this.resistance = 0;
        this.collides = true;
        this.detectsCollision = true;
        this.size = 50;
    }
    onCollisionCallback(entity) {
        if (entity === this)
            return;
        const delta = this.position.subtract(entity.position);
        const dir = delta.dir;
        if (this.canShootFood &&
            (entity instanceof Flail_1.default || entity instanceof Player_1.default)) {
            this.animationSizeAddon = 10;
            this.lastHitTick = this.game.tickCount;
            const foodCount = Math.sqrt(entity.velocity.mag);
            for (let i = 0; i < foodCount; i++) {
                const food = new Food_1.default(this.game, Math.random() < 0.9 ? 200 : 1000);
                food.position = this.position;
                food.applyForce(dir + Math.random() * 0.3 - 0.15, Math.random() * 30);
            }
        }
    }
    writeBinary(writer, isCreation) {
        if (isCreation) {
            writer.vu(1);
            writer.string(this.name);
            writer.vu(0);
            writer.vu(0x00FF00 | 33554432);
        }
        writer.vi(this.position.x);
        writer.vi(this.position.y);
        writer.vu(this.size + this.animationSizeAddon);
    }
    tick(tick) {
        this.canShootFood = this.lastHitTick < tick - this.hitCooldown;
        this.animationSizeAddon *= 0.7;
        super.tick(tick);
    }
}
exports.default = Generator;
//# sourceMappingURL=Generator.js.map