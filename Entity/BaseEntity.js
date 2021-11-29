"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Vector_1 = require("../Vector");
const Entity_1 = require("./Entity");
/**
 * An entity that is visible and has physics
 */
class BaseEntity extends Entity_1.default {
    constructor(game) {
        super(game);
        this.position = Vector_1.default.fromPolar(Math.random() * 7, Math.pow((Math.random() * Math.sqrt(this.game.size)), 2));
        this.velocity = new Vector_1.default(0, 0);
        this.name = "";
        this.size = 0;
        this.friction = 0.95;
        this.restLength = 0;
        this.knockback = 0.9;
        this.resistance = 0.9;
        this.collides = false;
        this.detectsCollision = false;
        this.isAffectedByRope = false;
        this.isAffectedByWind = false;
    }
    get area() {
        return Math.PI * Math.pow(this.size, 2);
    }
    set area(v) {
        this.size = Math.sqrt(v / Math.PI);
    }
    applyForce(theta, distance, polar = true) {
        const addedVel = polar ? Vector_1.default.fromPolar(theta, distance) : new Vector_1.default(theta, distance);
        this.velocity = this.velocity.add(addedVel);
    }
    onCollisionCallback(entity) { }
    collideWith(entities) {
        entities.forEach((entity) => {
            if (entity.detectsCollision)
                this.onCollisionCallback(entity);
            if (!entity.collides || !this.collides)
                return;
            const delta = this.position.subtract(entity.position);
            const deltaDir = delta.dir;
            this.applyForce(deltaDir, entity.knockback * this.resistance);
            entity.applyForce(deltaDir + Math.PI, this.knockback * entity.resistance);
        });
    }
    findCollisions() {
        const ret = new Set();
        if (!this.detectsCollision)
            return ret;
        /** @ts-ignore */
        this.game.spatialHashing.query(this).forEach((entity) => {
            const delta = entity.position.subtract(this.position);
            const distance = delta.mag;
            const collisionDistance = entity.size + this.size;
            if (distance < collisionDistance)
                ret.add(entity);
        });
        return ret;
    }
    tick(tick) {
        super.tick(tick);
        this.velocity = this.velocity.scale(this.friction);
        this.position = this.position.add(this.velocity);
        this.collideWith(this.findCollisions());
        const mag = this.position.mag;
        if (mag + this.size > this.game.size) {
            this.applyForce(this.position.dir, -10);
        }
        if (this.isAffectedByWind) {
            this.position = this.position.add(Vector_1.default.fromPolar(this.game.windDirection, 0.3));
        }
    }
}
exports.default = BaseEntity;
//# sourceMappingURL=BaseEntity.js.map