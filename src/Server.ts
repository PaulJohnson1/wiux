import * as WebSocket from "ws";
import Game from "./Game";
import Client from "./Client";

export default class Server {
  public server: WebSocket.Server;
  public game: Game;
  public clients: Set<Client>;
  public shufflingPointer: number

  constructor(server: WebSocket.Server) {
    this.server = server;

    this.clients = new Set();
    this.game = new Game(this);
    this.shufflingPointer = 16777216;

    (process as any).game = this;

    this.server.on("connection", ws => {
      console.log("new player");
      this.shufflingPointer -= 400;
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
    }, 16);
  }

  tick() {
    this.game.tick(this.game.tickCount++);

    this.clients.forEach(client => client.tick(this.game.tickCount));
  }
}
