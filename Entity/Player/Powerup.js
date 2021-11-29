"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseEntity_1 = require("../BaseEntity");
const Player_1 = require("./Player");
const BaseDefinition_1 = require("./FlailDefinitions/BaseDefinition");
class Pownerup extends BaseEntity_1.default {
    constructor(game) {
        super(game);
        this.sentToClient = true;
        this.detectsCollision = true;
        this.collides = false;
        this.size = 25;
        this.name = "Powerup";
    }
    onCollisionCallback(entity) {
        if (!(entity instanceof Player_1.default))
            return;
        const RandomWeapon = BaseDefinition_1.default.getWeaponByName(BaseDefinition_1.default.flailNames[Math.floor(Math.random() * BaseDefinition_1.default.flailNames.length)]);
        if (RandomWeapon == null)
            throw new Error("wtf how");
        entity.weapon.terminate();
        /** @ts-ignore */
        entity.weapon = new RandomWeapon(entity);
        entity.powerupsCollected++;
        this.terminate();
    }
    writeBinary(writer, isCreation) {
        if (isCreation) {
            writer.vu(1); // circle type
            writer.string(this.name);
            writer.vu(1); // glow style
            writer.vu(0xbb2222 | 0x1000000); // color
        }
        writer.vi(this.position.x);
        writer.vi(this.position.y);
        writer.vu(this.size);
    }
}
exports.default = Pownerup;
//# sourceMappingURL=Powerup.js.map