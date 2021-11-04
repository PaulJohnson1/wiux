import Game from "../../Game";
import BaseEntity from "../BaseEntity";
import Flail from "./Flail";
import Rope from "./Rope/Rope";
import { Writer } from "../../Coder";

export default class Player extends BaseEntity {
  public flails: Set<Flail>;
  public ropes: Set<Rope>;

  constructor(game: Game) {
    super(game); 

    this.flails = new Set();
    this.ropes = new Set();

    new Flail(this.game, this);

    const flails = Array.from(this.flails);

    for (let i = 0; i < flails.length; i++) {
      new Rope(this.game, this, flails[i], 3, 0.1, 300);
    }
 
    this.size = 100;
  }

  terminate() {
    super.terminate();
    this.flails.forEach(flail => flail.terminate());
    this.ropes.forEach(rope => rope.terminate());
  }

  writeBinary(writer: Writer, isCreation: boolean) {
    if (isCreation) {
      writer.vu(1); // player type
    }
    
    writer.vi(this.position.x);
    writer.vi(this.position.y);
    writer.vu(this.size);
  }
}
