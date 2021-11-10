import Server from "./Server";
import Entity from "./Entity/Entity";
import BaseEntity from "./Entity/BaseEntity";
import GameSpatialHashing from "./SpatialHashing";

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

    this.entities = new Set();
    this._entities = {};

    this.spatialHashing = new GameSpatialHashing(10, this);

    this.size = 850;

    setInterval(() => {
      console.time("tick");
      this.tick(this.tickCount++);
      console.timeEnd("tick");
    }, 1000 / 40);
  }

  tick(tick: number) {
    this.spatialHashing.clear();

    this._entities = {};

    this.entities.forEach(entity => {
      this._entities[entity.id] = entity;
    });

    this.entities.forEach(entity => {
      if (!(entity instanceof BaseEntity)) return;

      this.spatialHashing.insert(entity);
    });

    this.entities.forEach(entity => entity.tick(tick));
  }
}
