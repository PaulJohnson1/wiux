"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseEntity_1 = require("../BaseEntity");
const Flail_1 = require("./Flail");
const Basic_1 = require("./FlailDefinitions/Basic");
class Player extends BaseEntity_1.default {
    constructor(game, name, client) {
        super(game);
        this.name = name;
        this.client = client;
        this.size = 10;
        this.collides = true;
        this.detectsCollision = true;
        this.restLength = this.size;
        this.weapon = new Basic_1.default(this);
        this.color = (Math.random() * 0xFFFFFF) | 33554432;
    }
    terminate() {
        super.terminate();
        this.weapon.terminate();
        if (this.client != null)
            this.client.player = null;
    }
    onCollisionCallback(entity) {
        if (entity instanceof Flail_1.default && entity.owner !== this) {
            this.terminate();
        }
    }
    writeBinary(writer, isCreation) {
        if (isCreation) {
            writer.vu(1);
            writer.string(this.name);
            writer.vu(2);
            writer.vu(this.color);
        }
        writer.vi(this.position.x);
        writer.vi(this.position.y);
        writer.vu(this.size);
    }
}
exports.default = Player;
//# sourceMappingURL=Player.js.map