import BaseEntity from "../BaseEntity";
import Flail from "../Player/Flail";
import Game from "../../Game";
import { Writer } from "../../Coder";

export default class Food extends BaseEntity {
  constructor(game: Game, area: number) {
    super(game);

    this.area = area;
    this.collides = true;
    this.detectsCollision = true;
    this.isAffectedByWind = true;
    this.onMinimap = true;
    
    this.color = Math.random() * 360;
  }

  onCollisionCallback(entity: BaseEntity) {
    if (entity === this) return;

    if (entity instanceof Food) {
      if (this.size + entity.size > 100) return;

      if (this.size > entity.size) {
        entity.terminate();
        this.area += entity.area * 0.7;
      } else {
        this.terminate();
        entity.area += this.area * 0.7;
      }
    }

    if (!(entity instanceof Flail)) return;

    entity.area += this.area;
    super.terminate();
  }
}
