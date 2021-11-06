import Server from "./Server";
import Entity from "./Entity/Entity";
import BaseEntity from "./Entity/BaseEntity";
import SpatialHashing from "./SpatialHashing";

export default class Game {
  public server: Server;
  
  /* used for getting an entity by its id */
  public _entities: { [id: number ]: Entity }; 
  public entities: Set<Entity>;

  public tickCount: number;
  public nextId: number;
  public size: number;
  public spatialHashing: SpatialHashing;

  constructor(server: Server) {
    this.server = server;

    this.nextId = 1; // this `1` is needed since entities are null terminated in the protocol
    this.tickCount = 0;

    this.entities = new Set();
    this._entities = {};

    this.spatialHashing = new SpatialHashing(30);

    this.size = 850;

    setInterval(() => {
      console.time("tick");
      this.tick(this.tickCount++);
      console.timeEnd("tick");
    }, 1000 / 40);
  }

  tick(tick: number) {
    this.spatialHashing.clear();

    this.entities.forEach(entity => {
      if (!(entity instanceof BaseEntity)) return;

      this.spatialHashing.insert({
        x: entity.position.x,
        y: entity.position.y,
        w: entity.size,
        h: entity.size,
        id: entity.id
      });
    });

    this._entities = {};

    this.entities.forEach(entity => {
      this._entities[entity.id] = entity;
    });

    this.entities.forEach(entity => entity.tick(tick));
  }
}
