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

    this.size = 0;
  }

  applyForce(distance: number, theta: number, polar = true) {
    const addedVel = polar ? Vector.fromPolar(distance, theta) : new Vector(distance, theta);

    this.velocity = this.velocity.add(addedVel)
  }

  tick(tick: number) {
    super.tick(tick)

    this.velocity = this.velocity.scale(0.9);

    this.position = this.position.add(this.velocity);
  }
}
