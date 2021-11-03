import Game from "../../Game";
import BaseEntity from "../BaseEntity";
import Flail from "./Flail";
import { Writer } from "../../Coder";

export default class Player extends BaseEntity {
  public flails: Flail[];

  constructor(game: Game) {
    super(game);

    this.flails = [];

    new Flail(this.game, this);
  }

  writeBinary(writer: Writer, isCreation: boolean) {
    if (isCreation) {
      writer.vu(1); // player type
    }
    
    writer.vi(this.position.x);
    writer.vi(this.position.y);
  }
}
