import * as WebSocket from "ws";
import Game from "./Game";

export default class Server {
  public server: WebSocket.Server;
  public game: Game;

  constructor(server: WebSocket.Server) {
    this.server = server;

    this.game = new Game(this);

    this.server.on("connection", () => {
      console.log("connection");
    });
  }
}
