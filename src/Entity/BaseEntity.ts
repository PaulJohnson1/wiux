import Game from "../Game";
import Vector from "../Vector";
import Entity from "./Entity";

/**
 * An entity that is visible and has physics
 */
export default class BaseEntity extends Entity {
  public position: Vector;
  public velocity: Vector;
  public size: number;
  public isAffectedByRope: boolean;
  public collides: boolean;

  constructor(game: Game) {
    super(game);

    this.position = new Vector(0, 0);
    this.velocity = new Vector(0, 0);

    this.size = 0;
    this.collides = false;
    this.isAffectedByRope = false;
  }

  get area() {
    return Math.PI * this.size ** 2;
  }

  set area(v: number) {
    this.size = Math.sqrt(v / Math.PI)
  }

  applyForce(theta: number, distance: number, polar = true) {
    const addedVel = polar ? Vector.fromPolar(theta + Math.PI, distance) : new Vector(theta, distance);

    this.velocity = this.velocity.add(addedVel)
  }

  findCollisions() {
    if (!this.collides) return;

    this.game.entities.forEach(entity => {
      if (!(entity instanceof BaseEntity)) return;
      if (!entity.collides) return;
      if (entity === this) return;

      const collisionRadius = this.size + entity.size;
      const delta = this.position.subtract(entity.position);
      const distance = delta.mag;

      if (distance < collisionRadius) {

        const deltaDir = delta.dir;

        const distancInside = collisionRadius - distance;

        const force = distancInside / 30;

        this.applyForce(deltaDir + Math.PI, force);
        entity.applyForce(deltaDir, force);
      }
    });
  }

  tick(tick: number) {
    super.tick(tick);

    this.velocity = this.velocity.scale(0.95);
    this.position = this.position.add(this.velocity);
    this.findCollisions();
  }
}
