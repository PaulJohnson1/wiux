import * as WebSocket from "ws";
import Player from "./Entity/Player";

export default class Client extends Player {
  public socket: WebSocket;

  constructor(game: Game, socket: WebSocket) {
    super(game);

    this.socket = socket;
  }
}