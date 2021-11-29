"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseDefinition_1 = require("./BaseDefinition");
const Rope_1 = require("../Rope/Rope");
const Flail_1 = require("../Flail");
class BasicFlail extends BaseDefinition_1.default {
    constructor(owner) {
        super(owner);
        this.flails[0] = new Flail_1.default(this.owner.game, this.owner);
        this.ropes[0] = new Rope_1.default(this.owner.game, this.owner, this.flails[0], 3, 0.1, 20);
        const length = 3;
        for (let i = 0; i < length; i++) {
            this.flails[i + 1] = new Flail_1.default(this.owner.game, this.owner);
            this.ropes[i + 1] = new Rope_1.default(this.owner.game, this.flails[i], this.flails[i + 1], 1, 0.1, 20);
        }
        this.ropes[length + 1] = new Rope_1.default(this.owner.game, this.owner, this.flails[length], 3, 0.1, 20);
    }
}
exports.default = BasicFlail;
//# sourceMappingURL=Loop.js.map