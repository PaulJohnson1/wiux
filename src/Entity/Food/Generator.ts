import BaseEntity from "../BaseEntity";
import Food from "./Food";
import Flail from "../Player/Flail";
import Player from "../Player/Player"
import Game from "../../Game";
import Vector from "../../Vector";
import { Writer } from "../../Coder";

export default class Generator extends BaseEntity {
  private lastHitTick: number;
  private canShootFood: boolean;

  public hitCooldown: number;

  constructor(game: Game) {
    super(game);

    this.lastHitTick = 0;
    this.canShootFood = true;

    this.hitCooldown = 2;

    this.collides = false;
    this.detectsCollision = true;
    this.size = 50;
  }

  onCollisionCallback(entity: BaseEntity) {
    if (entity === this) return;

    const delta = entity.position.subtract(this.position);
    const dir = delta.dir;

    entity.applyForce(dir + Math.PI, 10);

    if (
      this.canShootFood &&
      (entity instanceof Flail || entity instanceof Player)
    ) {
      this.lastHitTick = this.game.tickCount;

      const foodCount = entity.velocity.mag / 10;

      for (let i = 0; i < foodCount; i++) {
        const food = new Food(this.game, 1000);
        food.position = this.position;
        food.applyForce(dir + Math.random() * 0.3 - 0.15, 20 + Math.random() * 10);
      }
    }
  }

  writeBinary(writer: Writer, isCreation: boolean) {
    if (isCreation) {
      writer.vu(1)
      writer.string(this.name);
      writer.vu(0);
      writer.vu(0x00FF00 | 33554432);
    }

    writer.vi(this.position.x);
    writer.vi(this.position.y);
    writer.vu(this.size);
  }

  tick(tick: number) {
    this.canShootFood = this.lastHitTick < tick - this.hitCooldown;
  
    super.tick(tick);
  }
}
