import Server from "./Server";
import Entity from "./Entity/Entity";
import BaseEntity from "./Entity/BaseEntity";
import Food from "./Entity/Food/Food";
import GameSpatialHashing from "./SpatialHashing";
import Vector from "./Vector";

export default class Game {
  public server: Server;
  
  /* used for getting an entity by its id */
  public _entities: { [id: number ]: Entity }; 
  public entities: Set<Entity>;
  public tickCount: number;
  public nextId: number;
  public size: number;
  public spatialHashing: GameSpatialHashing;

  constructor(server: Server) {
    this.server = server;

    this.nextId = 1; // this `1` is needed since entities are null terminated in the protocol
    this.tickCount = 0;

    this.spatialHashing = new GameSpatialHashing(10, this);
    this.entities = new Set();
    this._entities = {};

    this.size = 850;
  }

  tick(tick: number) {
    this.spatialHashing.clear();

    this._entities = {};

    this.entities.forEach(entity => {
      this._entities[entity.id] = entity;
    });

    this.entities.forEach(entity => {
      if (!(entity instanceof BaseEntity) || !entity.detectsCollision) return;

      this.spatialHashing.insert(entity);
    });

    this.entities.forEach(entity => entity.tick(tick));

    if (this.server.clients.size > 0) {
      const food = new Food(this, Math.random() * 1000);

      food.position = Vector.fromPolar(Math.random() * 7, Math.random() * this.size);     
    }
  }
}
