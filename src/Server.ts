import * as WebSocket from "ws";
import Game from "./Game";
import Client from "./Client";

export default class Server {
  public server: WebSocket.Server;
  public game: Game;
  public clients: Set<Client>;

  constructor(server: WebSocket.Server) {
    this.server = server;

    this.clients = new Set();
    this.game = new Game(this);

    (process as any).game = this;

    this.server.on("connection", ws => {
      console.log("new player");
      
      const client = new Client(this.game, ws);
      /** @ts-ignore */
      ws.client = client;
      ws.on("close", () => {
        /** @ts-ignore */
        client.terminateSocket();
      });
    });

    setInterval(() => {
      console.time("tick");
      this.tick();
      console.timeEnd("tick");
      console.log("entities", this.game.entities.size);
    }, 40);
  }

  tick() {
    this.game.tick(this.game.tickCount++);

    this.clients.forEach(client => client.tick(this.game.tickCount));
  }
}
