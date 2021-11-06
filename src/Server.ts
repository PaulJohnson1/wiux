import * as WebSocket from "ws";
import Game from "./Game";
import Client from "./Client";

export default class Server {
  public server: WebSocket.Server;
  public game: Game;

  constructor(server: WebSocket.Server) {
    this.server = server;

    this.game = new Game(this);

    (process as any).game = this;

    this.server.on("connection", ws => {
      console.log("new player");
      
      const client = new Client(this.game, ws);
      /** @ts-ignore */
      ws.client = client;
      ws.on("close", () => {
        /** @ts-ignore */
        client.terminate();
      });
    });
  }
}
