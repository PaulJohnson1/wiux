import BaseEntity from "../BaseEntity";
import Food from "./Food";
import Flail from "../Player/Flail";
import Player from "../Player/Player"
import Game from "../../Game";
import { Writer } from "../../Coder";
import { getBaseLog } from "../../util";

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
    this.hitCooldown = 2;
    this.size = 200;
    this.knockback = 0.2;
    this.resistance = 0;
    this.style = 0
    this.color = 100;

    this.collides = true;
    this.detectsCollision = true;
    this.onMinimap = true;
  }

  onCollisionCallback(entity: BaseEntity) {
    if (entity === this) return;

    const delta = entity.position.subtract(this.position);
    const dir = delta.dir + Math.PI;

    if (
      !this.canShootFood ||
      !(entity instanceof Flail || entity instanceof Player)
    ) return; 

    this.animationSizeAddon = 10;
    this.lastHitTick = this.game.tickCount;

    const foodCount = getBaseLog(entity.velocity.mag + 1, 1.20);

    for (let i = 0; i < foodCount; i++) {
      const food = new Food(this.game, 10, 125);
      food.position = this.position.movePointByAngle(20 + Math.random() * 50, dir);
    }
  }

  writeBinary(writer: Writer, isCreation: boolean) {
    if (isCreation) {
      writer.vu(1)
      writer.string(this.name);
      writer.vu(0);
      writer.vu(this.color);
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
