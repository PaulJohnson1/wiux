import * as WebSocket from "ws";
import Game from "./Game";
import Client from "./Client";

export default class Server {
  public server: WebSocket.Server;
  public game: Game;
  public clients: Set<Client>;
  public shufflingPointer: number
  public ticksPerSecond: number;
  public deltaTick: number;

  constructor(server: WebSocket.Server) {
    this.server = server;

    this.clients = new Set();
    this.game = new Game(this);
    this.shufflingPointer = 16777216;
    this.ticksPerSecond = 20;
    this.deltaTick = 1000 / this.ticksPerSecond;

    (process as any).game = this;

    this.server.on("connection", ws => {
      console.log("new player");
      this.shufflingPointer -= 4;
      const client = new Client(this.game, this.shufflingPointer, ws);
      /** @ts-ignore */
      ws.client = client;
      ws.on("close", () => {
        /** @ts-ignore */
        client.terminateSocket();
      });
    });

    setInterval(() => {
      this.tick();
    }, 1000 / this.ticksPerSecond);
  }

  private tick() {
    this.game.tick(this.game.tickCount++);

    this.clients.forEach(client => client.tick(this.game.tickCount));
  }
}
