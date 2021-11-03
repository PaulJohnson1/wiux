import * as WebSocket from "ws";
import Game from "./Game";
import Client from "./Client";

export default class Server {
  public server: WebSocket.Server;
  public game: Game;

  constructor(server: WebSocket.Server) {
    this.server = server;

    this.game = new Game(this);

    this.server.on("connection", ws => {
      /** @ts-ignore */
      ws.client = new Client(this.game, ws);
    });
  }
}
