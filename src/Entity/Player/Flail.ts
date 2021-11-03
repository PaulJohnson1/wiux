import BaseEntity from "../BaseEntity";
import Game from "../../Game";
import Player from "./Player";


/**
 * Child of a player
 */
export default class Flail extends BaseEntity {
  public owner: Player;

  constructor(game: Game, owner: Player) {
    super(game);
    this.owner = owner;

    this.owner.flails.push(this);
  }
}
