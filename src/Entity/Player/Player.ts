import Game from "../../Game";
import BaseEntity from "../BaseEntity";
import Flail from "./Flail";

export default class Player extends BaseEntity {
  public flails: Flail[];

  constructor(game: Game) {
    super(game);

    this.flails = [];

    new Flail(this.game, this);

    console.log(this);
  }
}
