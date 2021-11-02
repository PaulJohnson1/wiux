import Server from "./Server";

export default class Game {
  public server: Server;

  constructor(server: Server) {
    this.server = server;
  }
}