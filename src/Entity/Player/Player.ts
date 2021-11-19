import Game from "../../Game";
import BaseEntity from "../BaseEntity";
import Flail from "./Flail";
import Rope from "./Rope/Rope";
import Client from "../../Client";
import BasicFlail from "./FlailDefinitions/Basic";
import FlailDefinition from "./FlailDefinitions/BaseDefinition";
import { Writer } from "../../Coder";

export default class Player extends BaseEntity {
  public weapon: FlailDefinition;
  public client?: Client;
  public name: string;
  public color: number;

  constructor(game: Game, name: string, client?: Client) {
    super(game); 

    this.name = name;
    this.client = client;

    this.size = 10;
    this.collides = true;
    this.detectsCollision = true;

    this.restLength = this.size;

    this.weapon = new BasicFlail(this);


    this.color = (Math.random() * 0xFFFFFF) | 33554432;
  }

  terminate() {
    super.terminate();
    this.weapon.terminate();

    if (this.client != null) this.client.player = null;
  }

  onCollisionCallback(entity: BaseEntity) {
    if (entity instanceof Flail && entity.owner !== this) {
      this.terminate();
    }
  }

  writeBinary(writer: Writer, isCreation: boolean) {
    if (isCreation) {
      writer.vu(1);
      writer.string(this.name);
      writer.vu(2);
      writer.vu(this.color);
    }
    
    writer.vi(this.position.x);
    writer.vi(this.position.y);
    writer.vu(this.size);
  }
}
