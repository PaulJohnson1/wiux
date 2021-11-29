import BaseEntity from "../BaseEntity";
import Flail from "../Player/Flail";
import Game from "../../Game";
import { Writer } from "../../Coder";

export default class Food extends BaseEntity {
  constructor(game: Game, area: number) {
    super(game);

    this.area = area;
    this.detectsCollision = true;
    this.isAffectedByWind = true;
    this.color = Math.random() * 360;
  }

  onCollisionCallback(entity: BaseEntity) {
    if (!(entity instanceof Flail)) return;

    entity.area += this.area;
    super.terminate();
  }
}
