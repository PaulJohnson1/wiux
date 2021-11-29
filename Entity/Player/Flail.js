"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseEntity_1 = require("../BaseEntity");
const Food_1 = require("../Food/Food");
const Vector_1 = require("../../Vector");
/**
 * Child of a player
 */
class Flail extends BaseEntity_1.default {
    constructor(game, owner) {
        super(game);
        this.owner = owner;
        this.position = this.owner.position;
        this.rope = null;
        this.size = 50;
        this.isAffectedByRope = true;
        this.collides = true;
        this.detectsCollision = true;
    }
    writeBinary(writer, isCreation) {
        if (isCreation) {
            writer.vu(1);
            writer.string(this.name);
            writer.vu(1);
            writer.vu(this.owner.color);
        }
        writer.vi(this.position.x);
        writer.vi(this.position.y);
        writer.vu(this.size);
    }
    terminate() {
        super.terminate();
        const area = this.area;
        const foodCount = this.size;
        const foodSize = area / foodCount * 0.7;
        for (let i = 0; i < foodCount; i++) {
            const food = new Food_1.default(this.game, foodSize);
            // using polar coords in order to make the food more consentrat,d towards the middle
            food.position = this.position.add(Vector_1.default.fromPolar(Math.random() * 6.29, Math.random() * this.size));
        }
    }
    tick(tick) {
        // if (this.size > this.game.size / 3) this.size = this.game.size / 3;
        this.restLength = this.size;
        super.tick(tick);
    }
}
exports.default = Flail;
//# sourceMappingURL=Flail.js.map