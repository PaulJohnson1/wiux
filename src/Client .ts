import * as WebSocket from "ws";
import Game from "./Game";

export default class Client {
  public game: Game;
  public socket: WebSocket;

  constructor(game: Game, socket: WebSocket) {
    this.game = game;
    this.socket = socket;
  }
}