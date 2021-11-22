import Game from "../Game";
import Vector from "../Vector";
import Entity from "./Entity";

/**
 * An entity that is visible and has physics
 */
export default class BaseEntity extends Entity {
  public position: Vector;
  public velocity: Vector;

  public name: string;

  public size: number;
  public friction: number;
  public restLength: number;
  public resistance: number;
  public knockback: number;

  public collides: boolean;
  public detectsCollision: boolean;
  public isAffectedByRope: boolean;
  public isAffectedByWind: boolean;

  constructor(game: Game) {
    super(game);

    this.position = Vector.fromPolar(Math.random() * 7, (Math.random() * Math.sqrt(this.game.size)) ** 2);
    this.velocity = new Vector(0, 0);

    this.name = "";

    this.size = 0;
    this.friction = 0.95;
    this.restLength = 0;
    this.knockback = 0.9;
    this.resistance = 0.9;

    this.collides = false;
    this.detectsCollision = false;
    this.isAffectedByRope = false;
    this.isAffectedByWind = false;
  }

  get area() {
    return Math.PI * this.size ** 2;
  }

  set area(v: number) {
    this.size = Math.sqrt(v / Math.PI)
  }

  applyForce(theta: number, distance: number, polar = true) {
    const addedVel = polar ? Vector.fromPolar(theta, distance) : new Vector(theta, distance);

    this.velocity = this.velocity.add(addedVel)
  }

  onCollisionCallback(entity: BaseEntity) {}

  collideWith(entities: Set<BaseEntity>) {
    entities.forEach((entity: BaseEntity) => {
      if (entity.detectsCollision) this.onCollisionCallback(entity);

      if (!entity.collides || !this.collides) return;
      const delta = this.position.subtract(entity.position);
      const deltaDir = delta.dir;

      this.applyForce(deltaDir, entity.knockback * this.resistance);
      entity.applyForce(deltaDir + Math.PI, this.knockback * entity.resistance);
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

    this.velocity = this.velocity.scale(this.friction);
    this.position = this.position.add(this.velocity);
    this.collideWith(this.findCollisions());

    const mag = this.position.mag;

    if (mag + this.size > this.game.size) {
      this.applyForce(this.position.dir, -10);
    }

    if (this.isAffectedByWind) {
      this.position = this.position.add(Vector.fromPolar(this.game.windDirection, 0.3));
    }
  }
}
