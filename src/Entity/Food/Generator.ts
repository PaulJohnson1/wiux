import BaseEntity from "../BaseEntity";
import Food from "./Food";
import Flail from "../Player/Flail";
import Player from "../Player/Player"
import Game from "../../Game";
import { Writer } from "../../Coder";

const sizeAnimation = [
  50, 51, 53, 56, 60,
  67, 63, 58, 53, 50
];

export default class Generator extends BaseEntity {
  private lastHitTick: number;
  private hitCooldown: number;
  private animationTick: number;
  private canShootFood: boolean;

  constructor(game: Game) {
    super(game);

    this.lastHitTick = 0;
    this.animationTick = -1;
    this.canShootFood = true;

    this.hitCooldown = 10;

    this.collides = false;
    this.detectsCollision = true;
    this.size = 50;
  }

  onCollisionCallback(entity: BaseEntity) {
    if (entity === this) return;

    const delta = entity.position.subtract(this.position);
    const dir = delta.dir;

    entity.applyForce(dir + Math.PI, 4);

    if (
      this.canShootFood &&
      (entity instanceof Flail || entity instanceof Player)
    ) {
      this.animationTick = 0;

      this.lastHitTick = this.game.tickCount;

      const foodCount = Math.sqrt(entity.velocity.mag);

      for (let i = 0; i < foodCount; i++) {
        const food = new Food(this.game, Math.random() < 0.9 ? 200 : 1000);
        food.position = this.position;
        food.applyForce(dir + Math.random() * 0.3 - 0.15, Math.random() * 30);
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

    if (this.animationTick !== -1 && this.animationTick < sizeAnimation.length - 2) {
      this.animationTick++;
    } else this.animationTick = -1;

    if (this.animationTick !== -1) this.size = sizeAnimation[this.animationTick];

    super.tick(tick);
  }
}
