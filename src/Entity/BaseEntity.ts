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
  public detectsCollision: boolean;

  constructor(game: Game) {
    super(game);

    this.position = new Vector(0, 0);
    this.velocity = new Vector(0, 0);

    this.size = 0;
    this.collides = false;
    this.detectsCollision = false;
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

  onCollisionCallback(entity: BaseEntity) {}

  collideWith(entities: Set<BaseEntity>) {
    entities.forEach((entity: BaseEntity) => {
      if (entity.detectsCollision) this.onCollisionCallback(entity);

      if (!entity.collides || !this.collides) return;
      const delta = entity.position.subtract(this.position);
      const deltaDir = delta.dir;

      this.applyForce(deltaDir, 2);
      entity.applyForce(deltaDir + Math.PI, 2);
    });
  }

  findCollisions(): Set<BaseEntity> {
    const ret: Set<BaseEntity> = new Set();

    if (!this.detectsCollision) return ret;

    /** @ts-ignore */
    this.game.spatialHashing.query(this).forEach((entity: BaseEntity) => {
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

    const mag = this.position.mag;

    if (mag + this.size > this.game.size) {
      this.position = this.position.movePointByAngle(mag + this.size - this.game.size, this.position.dir + Math.PI);
    }
  }
}
