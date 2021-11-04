import Server from "./Server";
import Entity from "./Entity/Entity";

export default class Game {
  public server: Server;
  public entities: Set<Entity>;
  public tickCount: number;
  public nextId: number;
  public size: number;

  constructor(server: Server) {
    this.server = server;

    this.nextId = 1; // this `1` is needed since entities are null terminated in the protocol
    this.tickCount = 0;
    this.entities = new Set();

    this.size = 850;

    setInterval(() => this.tick(this.tickCount++), 1000 / 40);
  }

  tick(tick: number) {
    this.entities.forEach(entity => {
      entity.tick(tick);
    });
  }
}
