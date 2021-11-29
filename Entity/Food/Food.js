"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseEntity_1 = require("../BaseEntity");
const Flail_1 = require("../Player/Flail");
class Food extends BaseEntity_1.default {
    constructor(game, area) {
        super(game);
        this.area = area;
        this.detectsCollision = true;
        this.isAffectedByWind = true;
    }
    onCollisionCallback(entity) {
        if (!(entity instanceof Flail_1.default))
            return;
        entity.area += this.area;
        super.terminate();
    }
    writeBinary(writer, isCreation) {
        if (isCreation) {
            writer.vu(1);
            writer.string(this.name);
            writer.vu(0);
            writer.vu((Math.random() * 0xFFFFFF) | 33554432);
        }
        writer.vi(this.position.x);
        writer.vi(this.position.y);
        writer.vu(this.size);
    }
}
exports.default = Food;
//# sourceMappingURL=Food.js.map