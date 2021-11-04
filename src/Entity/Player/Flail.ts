import BaseEntity from "../BaseEntity";
import Game from "../../Game";
import Player from "./Player";
import { Writer } from "../../Coder";

/**
 * Child of a player
 */
export default class Flail extends BaseEntity {
  public owner: Player;

  constructor(game: Game, owner: Player) {
    super(game);
    this.owner = owner;

    this.size = 1000;

    this.owner.flails.push(this);
  }

  writeBinary(writer: Writer, isCreation: boolean) {
    if (isCreation) {
      writer.vu(2); // flail type
    }
    
    writer.vu(this.size);
    writer.vi(this.position.x);
    writer.vi(this.position.y);
  }
}