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
    } else {
      // knock both entities back a bit

      const delta = entity.position.subtract(this.position);
      const deltaDir = delta.dir;

      this.applyForce(deltaDir, 2);
      entity.applyForce(deltaDir + Math.PI, 2);

      const oldArea = this.area;
      
      this.area /= 1.1;

      entity.area += oldArea - this.area;
    }
  }

  writeBinary(writer: Writer, isCreation: boolean) {
    if (isCreation) {
      writer.vu(1);
      writer.string("");
      writer.vu((Math.random() * 0xFFFFFF) | 33554432);
    }

    writer.vi(this.position.x);
    writer.vi(this.position.y);
    writer.vu(this.size);
  }
}
