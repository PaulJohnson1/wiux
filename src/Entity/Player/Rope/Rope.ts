import Entity from "../../Entity";
import BaseEntity from "../../BaseEntity";
import Game from "../../../Game";
import RopeSegment from "./RopeSegment";
import Player from "../Player";
import { Writer } from "../../../Coder";

export default class Rope extends Entity {
  private k: number;
  public length: number;
  public restLength: number;
  public segments: Set<BaseEntity>;
  public owner: Player;

  constructor(game: Game, entity1: Player, entity2: BaseEntity, length: number, springConstant: number, restLength: number) {
    super(game);

    this.length = length;
    this.k = springConstant;
    this.restLength = restLength;
    this.owner = entity1;

    this.segments = new Set([this.owner]);

    for (let i = 0; i < this.length; i++) {
      const ropeSegment = new RopeSegment(this.game, this);

      this.segments.add(ropeSegment);
    }

    this.segments.add(entity2)
  }

  writeBinary(writer: Writer, isCreation: boolean) {
    if (isCreation) {
      writer.vu(3);
    }
  }

  terminate() {
    super.terminate();

    this.segments.forEach(segment => {
      if (segment instanceof RopeSegment) segment.terminate();
    });
  }

  tick(tick: number) {
    const segments = Array.from(this.segments);

    for (let i = 1; i < segments.length; i++) {
      const a = segments[i - 1];
      const b = segments[i];

      const delta = a.position.subtract(b.position);
      const x = Math.max(0, delta.mag - this.restLength);
      
      let force = delta.unitVector.scale(-this.k * x);
      
      if (a.isAffectedByRope) a.applyForce(force.x, force.y, false);
      
      force = force.scale(-1);

      if (b.isAffectedByRope) b.applyForce(force.x, force.y, false);
    }
  }
}
