"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseEntity_1 = require("../../BaseEntity");
const RopeSegment_1 = require("./RopeSegment");
class Rope extends BaseEntity_1.default {
    constructor(game, entity1, entity2, length, springConstant, restLength) {
        super(game);
        this.length = length;
        this.k = springConstant;
        this.restLength = restLength;
        this.owner = entity1;
        this.detectsCollision = false;
        this.segments = new Set([this.owner]);
        for (let i = 0; i < this.length; i++) {
            const ropeSegment = new RopeSegment_1.default(this.game, this);
            ropeSegment.restLength = this.restLength;
            this.segments.add(ropeSegment);
        }
        this.segments.add(entity2);
    }
    /** @ts-ignore */
    get position() {
        return this.owner.position;
    }
    /** @ts-ignore */
    set position(a) { }
    writeBinary(writer, isCreation) {
        if (isCreation) {
            writer.vu(2);
            writer.vu(this.segments.size);
        }
        this.segments.forEach(segment => {
            writer.vi(segment.position.x);
            writer.vi(segment.position.y);
        });
    }
    terminate() {
        super.terminate();
        this.segments.forEach(segment => {
            if (segment instanceof RopeSegment_1.default)
                segment.terminate();
        });
    }
    tick(tick) {
        const segments = Array.from(this.segments);
        for (let i = 1; i < segments.length; i++) {
            const a = segments[i - 1];
            const b = segments[i];
            const delta = a.position.subtract(b.position);
            const x = delta.mag - Math.max(a.restLength, b.restLength);
            let force = delta.unitVector.scale(-this.k * x);
            if (a.isAffectedByRope)
                a.applyForce(force.x, force.y, false);
            force = force.scale(-1);
            if (b.isAffectedByRope)
                b.applyForce(force.x, force.y, false);
        }
    }
}
exports.default = Rope;
//# sourceMappingURL=Rope.js.map