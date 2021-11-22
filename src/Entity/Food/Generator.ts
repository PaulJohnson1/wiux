import BaseEntity from "../BaseEntity";
import Food from "./Food";
import Flail from "../Player/Flail";
import Player from "../Player/Player"
import Game from "../../Game";
import { Writer } from "../../Coder";

export default class Generator extends BaseEntity {
  private lastHitTick: number;
  private hitCooldown: number;
  private animationSizeAddon: number;
  private canShootFood: boolean;

  constructor(game: Game) {
    super(game);

    this.animationSizeAddon = 0;
    this.canShootFood = true;

    this.lastHitTick = 0;
    this.hitCooldown = 10;

    this.knockback = 5;
    this.resistance = 0;

    this.collides = true;
    this.detectsCollision = true;
    this.size = 50;
  }

  onCollisionCallback(entity: BaseEntity) {
    if (entity === this) return;

    const delta = this.position.subtract(entity.position);
    const dir = delta.dir;

    if (
      this.canShootFood &&
      (entity instanceof Flail || entity instanceof Player)
    ) {
      this.animationSizeAddon = 10;
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
    writer.vu(this.size + this.animationSizeAddon);
  }

  tick(tick: number) {
    this.canShootFood = this.lastHitTick < tick - this.hitCooldown;

    this.animationSizeAddon *= 0.7;

    super.tick(tick);
  }
}
