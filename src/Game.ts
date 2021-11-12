import Server from "./Server";
import Entity from "./Entity/Entity";
import BaseEntity from "./Entity/BaseEntity";
import Food from "./Entity/Food/Food";
import GameSpatialHashing from "./SpatialHashing";

export default class Game {
  public server: Server;
  
  /* used for getting an entity by its id */
  public _entities: { [id: number ]: Entity }; 
  public entities: Set<Entity>;
  public tickCount: number;
  public nextId: number;
  public size: number;
  public ambientFoodConsentration: number;
  public spatialHashing: GameSpatialHashing;

  constructor(server: Server) {
    this.server = server;

    this.nextId = 1; // this `1` is needed since entities are null terminated in the protocol
    this.tickCount = 0;

    this.spatialHashing = new GameSpatialHashing(10, this);
    this.entities = new Set();
    this._entities = {};

    this.size = 850;
    this.ambientFoodConsentration = 20;
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

    for (let x = -this.size; x < this.size; x += Math.random() * this.ambientFoodConsentration) {
      y: for (let y = -this.size; y < this.size; y += Math.random() * this.ambientFoodConsentration) {
        if (x ** 2 + y ** 2 > this.size ** 2) continue y;

        const noiseValue = Math.random(); 

        if (noiseValue > 0.99999) {
          const food = new Food(this, 100);
          food.position.x = x;
          food.position.y = y;
        }
      }
    }
  }
}
