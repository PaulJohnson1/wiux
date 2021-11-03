import Game from "../Game";
import Vector from "../Vector";
import Entity from "./Entity";

/**
 * An entity that is visible and has physics
 */
export default class BaseEntity extends Entity {
  public position: Vector;
  public velocity: Vector;

  constructor(game: Game) {
    super(game);

    this.position = new Vector(0, 0);
    this.velocity = new Vector(0, 0);
  }

  tick(tick: number) {
    super.tick(tick)
  
    this.position = this.position.add(this.velocity);
  }
}
