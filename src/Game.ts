import Server from "./Server";
import Entity from "./Entity/Entity";

export default class Game {
  public server: Server;
  public entities: Set<Entity>;
  public tickCount: number;

  constructor(server: Server) {
    this.server = server;

    this.tickCount = 0;
    this.entities = new Set();
  
    setInterval(() => this.tick(this.tickCount++), 1000 / 40);
  }

  tick(tick: number) {
    this.entities.forEach(entity => {
      entity.tick(tick);
    });
  }
}
