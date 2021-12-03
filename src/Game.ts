import Server from "./Server";
import Entity from "./Entity/Entity";
import BaseEntity from "./Entity/BaseEntity";
import Generator from "./Entity/Food/Generator";
import GameSpatialHashing from "./SpatialHashing";
import Vector from "./Vector";
import { Writer } from "./Coder";
import * as fs from "fs";

export default class Game {
  public server: Server;

  /* used for getting an entity by its id */
  public _entities: { [id: number]: Entity };
  public entities: Set<Entity>;
  public tickCount: number;
  public nextId: number;
  public size: number;
  public windDirection: number;
  public spatialHashing: GameSpatialHashing;
  public memory: WebAssembly.Memory;
  public wasm: any; // whatever WebAssembly.instantiate returns
  public HEAPU8: Uint8Array;

  constructor(server: Server) {
    this.server = server;

    this.nextId = 1; // this `1` is needed since entities are null terminated in the protocol
    this.tickCount = 0;

    this.spatialHashing = new GameSpatialHashing(this);

    this.entities = new Set();
    this._entities = {};

    this.memory = new WebAssembly.Memory({
      initial: 1024,
      maximum: 1024
    });

    this.HEAPU8 = new Uint8Array(this.memory.buffer)

    this.wasm = null

    WebAssembly.instantiate(
      fs.readFileSync(__dirname + "/../src/Shuffler/shuffle.wasm"),
      {
        a: { memory: this.memory },
      }
    ).then((wasm) => (this.wasm = wasm));

    this.size = 10000;
    this.windDirection = 0;

    const generators = 18;

    for (let i = 0; i < generators; i++) {
      const pos = Vector.fromPolar(Math.random() * 6, Math.random() * this.size);
      const generator = new Generator(this);
      generator.position = pos;
    }
  }

  tick(tick: number) {
    this.windDirection += Math.random() * 0.05 - 0.04;

    this.spatialHashing.clear();

    this._entities = {};

    this.entities.forEach(entity => {
      this._entities[entity.id] = entity;
    });

    this.entities.forEach(entity => {
      if (!(entity instanceof BaseEntity)) return;
      if (!entity.sentToClient) return; // has to be in the collision manager to be sent

      this.spatialHashing.insert(entity);
    });

    this.entities.forEach(entity => entity.tick(tick));

    if (tick % 60 === 0) {
      const writer = new Writer();

      writer.vu(5);

      this.entities.forEach(entity => {
        if (!(entity instanceof BaseEntity) || !entity.onMinimap) return;
        if (entity.size < 50) return;

        // % across the x and y axis
        writer.vi(-entity.position.x / this.size * 127);
        writer.vi(-entity.position.y / this.size * 127);
        writer.vu(entity.color);
        writer.vu(entity.size);      
      });

      writer.vi(1234);

      const encodedMinimap = writer.write();

      this.server.clients.forEach(client => {
        client.sendPacket(encodedMinimap);
      });
    }
  }
}
