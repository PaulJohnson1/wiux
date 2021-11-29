"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseEntity_1 = require("../../BaseEntity");
class RopeSegment extends BaseEntity_1.default {
    constructor(game, owner) {
        super(game);
        this.isAffectedByRope = true;
        this.collides = false;
        this.sentToClient = false;
        this.owner = owner;
        this.position = this.owner.position;
    }
}
exports.default = RopeSegment;
//# sourceMappingURL=RopeSegment.js.map