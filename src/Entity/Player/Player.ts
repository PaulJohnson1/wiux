import Game from "../../Game";
import BaseEntity from "../BaseEntity";
import Flail from "./Flail";
import Rope from "./Rope/Rope";
import Client from "../../Client";
import { Writer } from "../../Coder";

export default class Player extends BaseEntity {
  public flails: Set<Flail>;
  public ropes: Set<Rope>;
  public client?: Client;
  public name: string;
  public color: number;

  constructor(game: Game, name: string, client?: Client) {
    super(game); 

    this.name = name;
    this.client = client;

    this.flails = new Set();
    this.ropes = new Set();

    new Flail(this.game, this);

    const flails = Array.from(this.flails);

    for (let i = 0; i < flails.length; i++) {
      this.ropes.add(new Rope(this.game, this, flails[i], 3, 0.6, 50));
    }

    this.color = (Math.random() * 0xFFFFFF) | 33554432;
 
    this.size = 10;
    this.collides = true;
  }

  terminate() {
    super.terminate();
    this.flails.forEach(flail => flail.terminate());
    this.ropes.forEach(rope => rope.terminate());

    if (this.client != null) this.client.player = null;
  }

  onCollisionCallback(entity: BaseEntity) {
    if (entity instanceof Flail && entity.owner !== this) {
      this.terminate();

      entity.area += this.area;
    }
  }

  writeBinary(writer: Writer, isCreation: boolean) {
    if (isCreation) {
      writer.vu(1);
      writer.string(this.name);

      writer.vu(this.color);
    }
    
    writer.vi(this.position.x);
    writer.vi(this.position.y);
    writer.vu(this.size);
  }
}
