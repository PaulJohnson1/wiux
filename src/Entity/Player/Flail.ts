import BaseEntity from "../BaseEntity";
import Game from "../../Game";
import Player from "./Player";
import Food from "../Food/Food";
import Rope from "./Rope/Rope";
import Vector from "../../Vector";
import { Writer } from "../../Coder";

/**
 * Child of a player
 */
export default class Flail extends BaseEntity {
  public owner: Player;
  public rope?: Rope | null;

  constructor(game: Game, owner: Player) {
    super(game);
    this.owner = owner;

    this.rope = null;

    this.size = 50;
    this.isAffectedByRope = true;
    this.collides = true;
    this.detectsCollision = true;

    this.owner.flails.add(this);
  }

  writeBinary(writer: Writer, isCreation: boolean) {
    if (isCreation) {
      writer.vu(1);

      writer.string("");
      writer.vu(this.owner.color);
    }

    writer.vi(this.position.x);
    writer.vi(this.position.y);
    writer.vu(this.size);
  }

  terminate() {
    super.terminate();
    const area = this.area;

    const foodCount = this.size;
    const foodSize = area / foodCount / 10;

    for (let i = 0; i < foodCount; i++) {
      const food = new Food(this.game, foodSize);

      // using polar coords in order to make the food more consentrat,d towards the middle
      food.position = this.position.add(Vector.fromPolar(Math.random() * 6.29, Math.random() * this.size));
    }
  }

  tick(tick: number) {
    if (this.size > this.game.size / 3) this.size = this.game.size / 3;

    this.restLength = this.size;

    super.tick(tick);
  }
}
