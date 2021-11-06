import Game from "../Game";
import Vector from "../Vector";
import Entity from "./Entity";
import { Box } from "../SpatialHashing";


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

  collideWith(entities: Set<BaseEntity>) {
    if (!this.collides) return;

    entities.forEach((entity: BaseEntity) => {
      if (!entity.collides) return;
      const delta = entity.position.subtract(this.position);
      const deltaDir = delta.dir;

      this.applyForce(deltaDir, 2);
      entity.applyForce(deltaDir + Math.PI, 2);
    });
  }

  findCollisions(): Set<BaseEntity> {
    const ret: Set<BaseEntity> = new Set();

    this.game.spatialHashing.query({
      x: this.position.x,
      y: this.position.y,
      w: this.size,
      h: this.size
    }).forEach((box: Box) => {
      if (!box.id) throw new Error("collided with an entity that has no id");

      const entity = this.game._entities[box.id];

      if (!(entity instanceof BaseEntity)) return;

      const delta = entity.position.subtract(this.position);
      const distance = delta.mag;
      const collisionDistance = entity.size + this.size;

      if (distance < collisionDistance) ret.add(entity);
    });

    return ret;
  }

  tick(tick: number) {
    super.tick(tick);

    this.velocity = this.velocity.scale(0.95);
    this.position = this.position.add(this.velocity);
    this.collideWith(this.findCollisions());
  }
}
