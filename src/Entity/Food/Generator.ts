import BaseEntity from "../BaseEntity";
import Food from "./Food";
import Flail from "../Player/Flail";
import Player from "../Player/Player"
import Game from "../../Game";
import Vector from "../../Vector";
import { Writer } from "../../Coder";

export default class Generator extends BaseEntity {
  constructor(game: Game) {
    super(game);

    this.collides = false;
    this.detectsCollision = true;
    this.size = 50;
  }

  onCollisionCallback(entity: BaseEntity) {
    if (entity === this) return;

    const delta = entity.position.subtract(this.position);
    const dir = delta.dir;
    
    // entity.applyForce(dir + Math.PI, 2);

    if (entity instanceof Flail || entity instanceof Player) {
      const food = new Food(this.game, 100);

      food.position = this.position;

      food.applyForce(dir + Math.random() * 0.3 - 0.15, 10 + Math.random() * 5);
    }

    let x1 = this.position.x;
    let y1 = this.position.y;
    let x2 = entity.position.x;
    let y2 = entity.position.y;

    let distance = entity.position.distance(this.position);
    if (distance < 0.001) {
      distance = 2;
      x1++;
      x2--;
    }
    const collisionRadius = this.size + entity.size;

    const unitNormalX = (x2 - x1) / distance;
    const unitNormalY = (y2 - y1) / distance;

    const unitTangentialX = -unitNormalY;
    const unitTangentialY = unitNormalX;

    const coefficientOfRestitution = 1;

    x1 -= (unitNormalX * (collisionRadius - distance)) / 2;
    y1 -= (unitNormalY * (collisionRadius - distance)) / 2;
    x2 -= (unitNormalX * (distance - collisionRadius)) / 2;
    y2 -= (unitNormalY * (distance - collisionRadius)) / 2;

    const xv1 = this.velocity.x;
    const yv1 = this.velocity.y;
    const xv2 = entity.velocity.x;
    const yv2 = entity.velocity.y;

    const target1TangentialVelProjectionAfter =
      unitTangentialX * xv1 + unitTangentialY * yv1;
    const target2TangentialVelProjectionAfter =
      unitTangentialX * xv2 + unitTangentialY * yv2;


    const target1NormalVelProjection =
      unitNormalX * xv1 + unitNormalY * yv1;
    const target2NormalVelProjection =
      unitNormalX * xv2 + unitNormalY * yv2;


    const target1NormalVelProjectionAfter =
      (target1NormalVelProjection * (this.area - entity.area) +
        2 * entity.area * target2NormalVelProjection) /
      (this.area + entity.area);
    const target2NormalVelProjectionAfter =
      (target2NormalVelProjection * (entity.area - this.area) +
        2 * this.area * target1NormalVelProjection) /
      (this.area + entity.area);

      const target1NormalVelocityVectorX =
        target1NormalVelProjectionAfter * unitNormalX;
      const target1NormalVelocityVectorY =
        target1NormalVelProjectionAfter * unitNormalY;
      const target1TangentialVelocityVectorX =
        target1TangentialVelProjectionAfter * unitTangentialX;
      const target1TangentialVelocityVectorY =
        target1TangentialVelProjectionAfter * unitTangentialY;

      const target2NormalVelocityVectorX =
        target2NormalVelProjectionAfter * unitNormalX;
      const target2NormalVelocityVectorY =
        target2NormalVelProjectionAfter * unitNormalY;
      const target2TangentialVelocityVectorX =
        target2TangentialVelProjectionAfter * unitTangentialX;
      const target2TangentialVelocityVectorY =
        target2TangentialVelProjectionAfter * unitTangentialY;

      // this.velocity.x = (target1NormalVelocityVectorX + target1TangentialVelocityVectorX) * coefficientOfRestitution;
      // this.velocity.y = (target1NormalVelocityVectorY + target1TangentialVelocityVectorY) * coefficientOfRestitution;

      entity.velocity.x = (target2NormalVelocityVectorX + target2TangentialVelocityVectorX) * coefficientOfRestitution;
      entity.velocity.y = (target2NormalVelocityVectorY + target2TangentialVelocityVectorY) * coefficientOfRestitution;

      // this.position.x = x1;
      // this.position.y = y1;
      entity.position.x = x2;
      entity.position.y = y2;
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
    writer.vu(this.size);
  }
}
