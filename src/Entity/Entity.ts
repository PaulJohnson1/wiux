import Game from "../Game";
import { Writer } from "../Coder";

/**
 * Lowest level of an entity
 */
export default class Entity {
  public game: Game;
  public id: number;

  constructor(game: Game) {
    this.game = game;
    this.id = this.game.nextId++;

    this.game.entities.add(this);
  }

  terminate() {
    this.game.entities.delete(this);
  }

  writeBinary(writer: Writer, isCeation: boolean) {}

  tick(tick: number) {}
}
