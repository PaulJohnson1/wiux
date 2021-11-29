"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Lowest level of an entity
 */
class Entity {
    constructor(game) {
        this.game = game;
        this.id = this.game.nextId++;
        this.sentToClient = true;
        this.game.entities.add(this);
    }
    terminate() {
        this.game.entities.delete(this);
    }
    writeBinary(writer, isCeation) { }
    tick(tick) { }
}
exports.default = Entity;
//# sourceMappingURL=Entity.js.map