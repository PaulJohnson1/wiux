import Server from "./Server";
import Entity from "./Entity/Entity";

export default class Game {
  public server: Server;
  public entities: Set<Entity>;
  public tickCount: number;
  public nextId: number;
  public width: number;
  public height: number;

  constructor(server: Server) {
    this.server = server;

    this.nextId = 0;
    this.tickCount = 0;
    this.entities = new Set();

    this.width = 8500;
    this.height = 8500;
  
    setInterval(() => this.tick(this.tickCount++), 1000 / 40);
  }

  tick(tick: number) {
    this.entities.forEach(entity => {
      entity.tick(tick);
    });
  }
}
