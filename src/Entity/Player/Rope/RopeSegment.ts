import BaseEntity from "../../BaseEntity";
import Game from "../../../Game";
import Rope from "./Rope";
import { Writer } from "../../../Coder";

export default class RopeSegment extends BaseEntity {
  public owner: Rope;

  constructor(game: Game, owner: Rope) {
    super(game);

    this.isAffectedByRope = true;
    this.collides = false;
    this.owner = owner;
  }

  writeBinary(writer: Writer, isCreation: boolean) {
    if (isCreation) {
      writer.vu(4);
      writer.vu(this.owner.id);
    }

    writer.vi(this.position.x);
    writer.vi(this.position.y);
  }
}
