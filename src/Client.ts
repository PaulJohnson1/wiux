import * as WebSocket from "ws";
import Game from "./Game";
import Player from "./Entity/Player/Player";
import Entity from "./Entity/Entity";
import { Writer, Reader } from "./Coder";
import { PlayerInputs } from "./types";

export default class Client extends Player {
  public socket: WebSocket;
  public inputs: PlayerInputs;
  public view: Set<Entity>;

  constructor(game: Game, socket: WebSocket) {
    super(game);

    this.view = new Set();
    this.inputs = { angle: 0, distance: 0 };
    this.socket = socket;

    this.sendInit();

    this.socket.on("message", data => {
      const reader = new Reader(data as Buffer);

      const packetType = reader.vu();
      if (packetType === 0) {
        this.inputs.angle = reader.vi() / 64;
        this.inputs.distance = reader.vu();
      }
    });
  }

  sendInit() {
    const writer = new Writer();
    writer.vu(1);

    writer.vu(this.id);
    writer.vu(this.game.size);

    this.socket.send(writer.write());
  }

  sendUpdate() {
    const writer = new Writer();

    writer.vu(0);

    this.view.forEach(entity => {
      if (!this.game.entities.has(entity)) {
        this.view.delete(entity);
        writer.vu(entity.id);
      }
    });

    writer.vu(0);

    this.game.entities.forEach(entity => {
      const isCreation = !this.view.has(entity);

      if (isCreation) this.view.add(entity);
      writer.vu(entity.id);
      writer.vu(isCreation ? 1 : 0);
      entity.writeBinary(writer, isCreation);
    });

    writer.vu(0);

    this.socket.send(writer.write());
  }

  tick(tick: number) {
    if (this.inputs.distance > 80) this.applyForce(this.inputs.angle, 1);

    this.sendUpdate();

    super.tick(tick);
  }
}
