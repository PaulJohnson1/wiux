import * as WebSocket from "ws";
import Game from "./Game";
import Player from "./Entity/Player/Player";
import BaseEntity from "./Entity/BaseEntity";
import { Writer, Reader } from "./Coder";

export default class Client extends Player {
  public socket: WebSocket;
  public view: Set<BaseEntity>;

  constructor(game: Game, socket: WebSocket) {
    super(game);

    this.view = new Set();
    this.socket = socket;
  }

  sendUpdate() {
    const writer = new Writer();

    writer.vu(0);

    this.game.entities.forEach(entity => {
      writer.vu(entity.id);

      entity.writeBinary(writer);
    });

    writer.vu(0);

    console.log(new Uint8Array(writer.write()));
    this.socket.send(writer.write());
  }

  tick(tick: number) {
    super.tick(tick);

    this.sendUpdate();
  }
}
