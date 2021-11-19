import BaseDefinition from "./BaseDefinition";
import Rope from "../Rope/Rope";
import Flail from "../Flail";
import Player from "../Player";

export default class BasicFlail extends BaseDefinition {
  constructor(owner: Player) {
    super(owner);

    this.flails[0] = new Flail(this.owner.game, this.owner);
    this.ropes[0] = new Rope(
      this.owner.game,
      this.owner,
      this.flails[0],
      3,
      0.1,
      20
    );

    const length = 3;

    for (let i = 0; i < length; i++) {
      this.flails[i + 1] = new Flail(this.owner.game, this.owner);
      this.ropes[i + 1] = new Rope(
        this.owner.game,
        this.flails[i],
        this.flails[i + 1],
        1,
        0.1,
        20
      );
    }

    this.ropes[length + 1] = new Rope(
      this.owner.game,
      this.owner,
      this.flails[length],
      3,
      0.1,
      20
    );
  }
}
