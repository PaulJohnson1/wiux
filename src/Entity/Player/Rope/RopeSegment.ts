import BaseEntity from "../../BaseEntity";
import Game from "../../../Game";
import Rope from "./Rope";
import Vector from "../../../Vector"
import { Writer } from "../../../Coder";

export default class RopeSegment extends BaseEntity {
  public owner: Rope;

  constructor(game: Game, owner: Rope) {
    super(game);


    this.isAffectedByRope = true;
    this.collides = false;
    this.sentToClient = false;
    this.owner = owner;

    this.position = this.owner.position;
  }
}
