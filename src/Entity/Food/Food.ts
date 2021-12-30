import BaseEntity from "../BaseEntity";
import Flail from "../Player/Flail";
import Player from "../Player/Player";
import Game from "../../Game";
import { Writer } from "../../Coder";

export default class Food extends BaseEntity {
  public score: number;

  constructor(game: Game, size: number, score: number) {
    super(game);

    this.size = size;
    this.score = score;

    this.knockback = 0.05;
    this.resistance = 2

    this.collides = true;
    this.detectsCollision = true;
    this.isAffectedByWind = true;
    this.onMinimap = false;
    
    this.color = Math.random() * 360;
  }

  onCollisionCallback(entity: BaseEntity) {
    if (!(entity instanceof Flail) && !(entity instanceof Player)) return;

    entity.area += this.score;
    super.terminate();
  }
}
