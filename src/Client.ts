import * as WebSocket from "ws";
import Game from "./Game";
import Player from "./Entity/Player/Player";
import Entity from "./Entity/Entity";
import Vector from "./Vector";
import { Writer, Reader } from "./Coder";
import { PlayerInputs } from "./types";

export default class Client {
  public socket: WebSocket;
  public inputs: PlayerInputs;
  public game: Game;
  public player: Player | null;
  public view: Set<Entity>;
  public stats: number[];

  constructor(game: Game, socket: WebSocket) {
    this.game = game;

    this.game.server.clients.add(this);

    this.player = null;

    this.stats = [0, 0, 0, 0, 0, 0]

    this.view = new Set();
    this.inputs = { angle: 0, distance: 0, mousePressed: false };
    this.socket = socket;

    this.sendInit();

    this.socket.on("message", data => {
      const reader = new Reader(data as Buffer);

      const packetType = reader.vu();
      if (packetType === 0) {
        this.inputs.mousePressed = !!reader.vu();
        this.inputs.angle = reader.vi() / 64;
        this.inputs.distance = reader.vu();
      } else if (packetType === 1) {
        if (this.player != null) return;
        
        const name = reader.string().substring(0, 50);
        this.player = new Player(this.game, name, this);
        this.stats = [0, 0, 0, 0, 0, 0]
        this.sendPlayerId();
      } else if (packetType === 2) {
        if (this.player == null) return;

        const id = reader.vu();

        if (this.stats[id] == null) return;

        this.stats[id]++;

        if (id === 0) { // flail knockback
          this.player.weapon.flails.forEach(flail => {
            flail.knockback += 0.1;
          });
        } else if (id === 1) { // flail resitance
          this.player.weapon.flails.forEach(flail => {
            flail.resistance *= 0.9;
          });
        } else if (id === 2) { // flail friction
          this.player.weapon.flails.forEach(flail => {
            flail.friction = Math.sqrt(flail.friction); // keeps getting closer to 1 with each upgrade
          });
        }

        const writer = new Writer();
        writer.vu(3);
        writer.vu(id);
        writer.vu(this.stats[id]);

        this.socket.send(writer.write());
      }
    });
  }

  sendInit() {
    const writer = new Writer();
    writer.vu(1);

    writer.vu(this.game.size);

    this.socket.send(writer.write());
  }

  sendPlayerId() {
    if (this.player == null) throw new Error("cannot write player id");

    const writer = new Writer();
    writer.vu(2);

    writer.vu(this.player.id);

    this.socket.send(writer.write());
  }

  sendUpdate() {
    const writer = new Writer();

    writer.vu(0);

    /** @ts-ignore */
    const entitiesInView = new Set(this.game.spatialHashing.query({
      position: this.player ? this.player.position : new Vector(0, 0),
      size: 1100,
    })) as Set<Entity>;

    this.view.forEach((entity: Entity) => {
      if (!entity.sentToClient) return;

      if (!entitiesInView.has(entity)) {
        this.view.delete(entity);
        writer.vu(entity.id);
      }
    });

    writer.vu(0);

    entitiesInView.forEach((entity: Entity) => {
      if (!entity.sentToClient) return;

      const isCreation = !this.view.has(entity);

      if (isCreation) this.view.add(entity);

      writer.vu(entity.id);
      writer.vu(isCreation ? 1 : 0);
      entity.writeBinary(writer, isCreation);
    });

    writer.vu(0);

    this.socket.send(writer.write());
  }

  terminateSocket() {
    if (this.player != null) this.player.terminate();

    this.game.server.clients.delete(this);
  }

  tick(tick: number) {
    this.sendUpdate();

    if (this.player == null) return;

    if (this.inputs.distance > 80) this.player.applyForce(this.inputs.angle + Math.PI, 0.4);

    this.player.tick(tick);
  }
}
