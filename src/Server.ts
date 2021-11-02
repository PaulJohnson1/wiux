import * as WebSocket from "ws";

export default class Server {
  public server: WebSocket.Server;

  constructor(server: WebSocket.Server) {
    this.server = server;

    this.server.on("connection", () => {
      console.log("connection");
    });
  }
}