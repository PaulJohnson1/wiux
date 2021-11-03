import * as WebSocket from "ws";
import Game from "./Game";
import Player from "./Entity/Player/Player";
import Entity from "./Entity/Entity";
import { Writer, Reader } from "./Coder";

export default class Client extends Player {
  public socket: WebSocket;
  public view: Set<Entity>;

  constructor(game: Game, socket: WebSocket) {
    super(game);

    this.view = new Set();
    this.socket = socket;

    this.sendInit();
  }

  sendInit() {
    const writer = new Writer();
    writer.vu(1);

    writer.vu(this.id);
    writer.vu(this.game.width);
    writer.vu(this.game.height);

    this.socket.send(writer.write());
  }

  sendUpdate() {
    const writer = new Writer();

    writer.vu(0);

    this.view.forEach(entity => {
      if (!this.game.entities.has(entity)) {
        this.view.delete(entity);
      }
    });

    writer.vu(0);

    this.game.entities.forEach(entity => {
      const isCreation = !this.view.has(entity);

      if (isCreation) this.view.add(entity);

      writer.vu(isCreation ? 1 : 0);
      entity.writeBinary(writer, isCreation);
    });

    writer.vu(0);

    this.socket.send(writer.write());
  }

  tick(tick: number) {
    super.tick(tick);

    this.sendUpdate();
  }
}
