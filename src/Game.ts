import Server from "./Server";
import Entity from "./Entity/Entity";
import BaseEntity from "./Entity/BaseEntity";
import Generator from "./Entity/Food/Generator";
import GameSpatialHashing from "./SpatialHashing";
import Vector from "./Vector";

export default class Game {
  public server: Server;

  /* used for getting an entity by its id */
  public _entities: { [id: number]: Entity };
  public entities: Set<Entity>;
  public tickCount: number;
  public nextId: number;
  public size: number;
  public windDirection: number;
  public spatialHashing: GameSpatialHashing;

  constructor(server: Server) {
    this.server = server;

    this.nextId = 1; // this `1` is needed since entities are null terminated in the protocol
    this.tickCount = 0;

    this.spatialHashing = new GameSpatialHashing(this);
    this.entities = new Set();
    this._entities = {};

    this.size = 3000;
    this.windDirection = 0;

    const generators = 4;

    for (let i = 0; i < generators; i++) {
      const pos = Vector.fromPolar(Math.random() * 6, Math.random() * this.size);
      const generator = new Generator(this);
      generator.position = pos;
    }
  }

  tick(tick: number) {
    this.windDirection += Math.random() * 0.05 - 0.0225;

    this.spatialHashing.clear();

    this._entities = {};

    this.entities.forEach(entity => {
      this._entities[entity.id] = entity;
    });

    this.entities.forEach(entity => {
      if (!(entity instanceof BaseEntity)) return;
      if (!entity.sentToClient) return; // has to be in the collision manager to be sent

      this.spatialHashing.insert(entity);
    });

    this.entities.forEach(entity => entity.tick(tick));
  }
}
