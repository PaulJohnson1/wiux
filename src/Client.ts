import crypto = require("crypto")
import * as WebSocket from "ws";
import Game from "./Game";
import Player from "./Entity/Player/Player";
import Entity from "./Entity/Entity";
import Vector from "./Vector";
/** @ts-ignore */
import Shuffler from "./Shuffler/Shuffle";
import { Writer, Reader } from "./Coder";
import { PlayerInputs } from "./types";
import { Stat } from "./types";
import { getBaseLog } from "./util";

const hash = (str: string) => crypto.createHash("sha256").update(str).digest("hex");

export default class Client {
  public socket: WebSocket;
  public inputs: PlayerInputs;
  public game: Game;
  public player: Player | null;
  public view: Set<Entity>;
  public stats: Stat[];
  public playerSpeed: number;
  public shufflingPointer: number;
  public authenticated: boolean;
  private authKey: string;
  private wantedAuth: string;
  private sentAuth: boolean;

  constructor(game: Game, shufflingPointer: number, socket: WebSocket) {
    this.game = game;

    this.shufflingPointer = shufflingPointer

    this.authenticated = false;
    this.authKey = crypto.randomBytes(100).toString("hex");
    this.wantedAuth = hash(this.authKey);
    this.sentAuth = false;

    this.player = null;
    this.stats = [
      {
        value: 0,
        max: 10
      },
      {
        value: 0,
        max: 10
      },
      {
        value: 0,
        max: 10
      },
      {
        value: 0,
        max: 10
      },
      {
        value: 0,
        max: 10
      },
      {
        value: 0,
        max: 10
      }
    ];
    this.playerSpeed = 120;
    this.view = new Set();
    this.inputs = { angle: 0, distance: 0, mousePressed: false };
    this.socket = socket;

    this.sendInit();

    this.requestAuth();

    this.socket.on("message", data => {
      const reader = new Reader(data as Buffer);

      const packetType = reader.vu();
      if (packetType === 0) {
        this.inputs.mousePressed = !!reader.vu();
        this.inputs.angle = reader.vi() / 64;
        this.inputs.distance = reader.vu();
      } else if (packetType === 1) {
        if (!this.authenticated) return;
        if (this.player != null) return;
        
        const name = reader.string().substring(0, 50);
        this.player = new Player(this.game, name, this);
        this.stats = [
          {
            value: 0,
            max: 10
          },
          {
            value: 0,
            max: 10
          },
          {
            value: 0,
            max: 10
          },
          {
            value: 0,
            max: 10
          },
          {
            value: 0,
            max: 10
          },
          {
            value: 0,
            max: 10
          }
        ];
        this.playerSpeed = 0.4;
        this.updateStats();
        this.sendPlayerId();
      } else if (packetType === 2) {
        if (this.player == null) return;

        const id = reader.vu();

        if (this.stats[id] == null) return;

        const stat = this.stats[id];

        if (stat.value >= stat.max) return;

        // https://www.desmos.com/calculator/7zrxbkgeqp graph of statsAvailable. y = stats, x = flail size
        const statsAvailable = 1.5 * getBaseLog(this.player.weapon.flails[0].size / 23, 1.12);
        const statsUsed = this.statsUsed;

        if (statsUsed >= statsAvailable) return;
        
        stat.value++;

        if (id === 0) { // flail knockback
          this.player.weapon.flails.forEach(flail => {
            flail.knockback /= 0.9;
          });
        } else if (id === 1) { // flail resitance
          this.player.weapon.flails.forEach(flail => {
            flail.resistance *= 0.9;
          });
        } else if (id === 2) { // flail friction
          this.player.weapon.flails.forEach(flail => {
            flail.friction = Math.sqrt(flail.friction); // keeps getting closer to 1 with each upgrade
          });
        } else if (id === 3) { // rope's spring constant
          this.player.weapon.ropes.forEach(rope => {
            rope.k += 0.05;
          });
        } else if (id === 4) { // rope rest length
          this.player.weapon.ropes.forEach(rope => {
            rope.restLength += 10;
          });
        } else if (id === 5) { // player speed
          this.playerSpeed *= 1.1;
        }

        this.updateStats();
      } else if (packetType === 3) {
        if (this.sentAuth) return;

        this.sentAuth = true;
        const recievedAuth = reader.string();
        if (recievedAuth !== this.wantedAuth) {
          console.log("auth fail");
          return this.terminateSocket();
        }

        console.log("successful auth");
        this.authenticated = true;

        this.game.server.clients.add(this);
      }
    });
  }

  get shuffle() {
    return (packet: ArrayBuffer) => {
      /** @ts-ignore */
      return Shuffler.prototype.getRandom.call(this, packet);
    }
  }

  get statsUsed() {
    return this.stats.reduce((acc, v) => acc + v.value, 0)
  }

  requestAuth() {
    this.authenticated = false;
    const writer = new Writer();
    writer.vu(4);
    writer.string(this.authKey);

    this.sendPacket(writer.write())
  }

  updateStats() {
    const writer = new Writer();
    writer.vu(3);
    this.stats.forEach(stat => writer.vu(stat.value));

    writer.vu(this.statsUsed);

    this.sendPacket(writer.write())
  }

  sendInit() {
    const writer = new Writer();
    writer.vu(1);

    writer.vu(this.game.size);

    this.sendPacket(writer.write())
  }

  sendPlayerId() {
    if (this.player == null) throw new Error("cannot write player id");

    const writer = new Writer();
    writer.vu(2);

    writer.vu(this.player.id);

    this.sendPacket(writer.write())
  }

  sendUpdate() {
    const writer = new Writer();

    writer.vu(0);

    /** @ts-ignore */
    const entitiesInView = new Set(this.game.spatialHashing.query({
      position: this.player != null ? this.player.position : new Vector(0, 0),
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

    this.sendPacket(writer.write())
  }

  sendPacket(packet: ArrayBufferLike) {
    this.socket.send(this.shuffle(new Uint8Array(packet)));
  }

  terminateSocket() {
    if (this.player != null) this.player.terminate();

    if (!(
      this.socket.readyState === WebSocket.CLOSED ||
      this.socket.readyState === WebSocket.CLOSING
    )) this.socket.close();

    this.game.server.clients.delete(this);
  }

  tick(tick: number) {
    this.sendUpdate();

    if (this.player == null) return;

    if (this.inputs.distance > 80) this.player.applyAcceleration(this.inputs.angle + Math.PI, this.playerSpeed);

    this.player.tick(tick);
  }
}
