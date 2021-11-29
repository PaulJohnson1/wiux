"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BaseDefinition {
    constructor(owner) {
        this.owner = owner;
        this.flails = [];
        this.ropes = [];
    }
    terminate() {
        this.flails.forEach(flail => flail.terminate());
        this.ropes.forEach(rope => rope.terminate());
    }
}
exports.default = BaseDefinition;
//# sourceMappingURL=BaseDefinition.js.map