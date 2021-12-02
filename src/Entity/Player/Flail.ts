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

    this.position = this.owner.position;

    this.rope = null;

    this.size = 50;
    this.style = 1;

    this.isAffectedByRope = true;
    this.collides = true;
    this.detectsCollision = true;
    this.onMinimap = true;

    this.color = this.owner.color;
  }

  terminate() {
    super.terminate();
    const area = this.area;

    const foodCount = this.size;
    const foodSize = area / foodCount * 0.7;

    for (let i = 0; i < foodCount; i++) {
      const food = new Food(this.game, foodSize);

      // using polar coords in order to make the food more consentrat,d towards the middle
      food.position = this.position.add(Vector.fromPolar(Math.random() * 6.29, Math.random() * this.size));
    }
  }

  tick(tick: number) {
    this.restLength = this.size;

    super.tick(tick);
  }
}
