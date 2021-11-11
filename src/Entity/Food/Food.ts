import BaseEntity from "../BaseEntity";
import Flail from "../Player/Flail";
import Game from "../../Game";
import { Writer } from "../../Coder";

class Food extends BaseEntity {
  constructor(game: Game) {
    super(game);

    this.size = 4;
  }

  onCollisionCallback(entity: BaseEntity) {
    if (!(entity instanceof Flail)) return;
    super.terminate();
    entity.area += this.area;
  }

  writeBinary(writer: Writer, isCreation: boolean) {
    if (isCreation) {
      writer.vu(1);
      writer.vu(this.size);
    }

    
  }
}
