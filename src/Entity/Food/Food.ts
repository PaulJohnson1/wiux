import BaseEntity from "../BaseEntity";
import Flail from "../Player/Flail";
import Game from "../../Game";
import { Writer } from "../../Coder";

export default class Food extends BaseEntity {
  constructor(game: Game, area: number) {
    super(game);

    this.area = area;
    this.detectsCollision = true;
  }

  onCollisionCallback(entity: BaseEntity) {
    if (!(entity instanceof Flail)) return;

    if (this.size < entity.size) {
      entity.area += this.area;
      super.terminate();
    }
  }

  writeBinary(writer: Writer, isCreation: boolean) {
    if (isCreation) {
      writer.vu(1);

      writer.string("");
      
      writer.vu(0);

      writer.vu((Math.random() * 0xFFFFFF) | 33554432);
    }

    writer.vi(this.position.x);
    writer.vi(this.position.y);
    writer.vu(this.size);
  }
}
