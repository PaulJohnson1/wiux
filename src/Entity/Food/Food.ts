import BaseEntity from "../BaseEntity";
import Flail from "../Player/Flail";
import Game from "../../Game";
import { Writer } from "../../Coder";

export default class Food extends BaseEntity {
  constructor(game: Game, area: number) {
    super(game);

    this.area = area;

    this.knockback = 0.1;

    this.collides = true;
    this.detectsCollision = true;
    this.isAffectedByWind = true;
    this.onMinimap = false;
    
    this.color = Math.random() * 360;
  }

  onCollisionCallback(entity: BaseEntity) {
    if (entity === this) return;

    if (entity instanceof Food) {
      if (this.size + entity.size > 200) return;

      if (this.size > entity.size) {
        entity.terminate();
        this.area += entity.area;
      } else {
        this.terminate();
        entity.area += this.area;
      }
    }

    if (!(entity instanceof Flail)) return;

    entity.area += this.area;
    super.terminate();
  }
}
