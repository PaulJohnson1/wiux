import Player from "../Player";
import Flail from "../Flail";
import Rope from "../Rope/Rope";

export default class BaseDefinition {
  protected owner: Player;
  public flails: Flail[];
  public ropes: Rope[];

  protected constructor(owner: Player) {
    this.owner = owner;
    this.flails = [];
    this.ropes = [];
  }

  public terminate() {
    this.flails.forEach(flail => flail.terminate());
    this.ropes.forEach(rope => rope.terminate());
  }
}
