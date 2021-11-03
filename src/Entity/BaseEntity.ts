import Game from "../Game"
import Entity from "./Entity";

export default class BaseEntity extends Entity {
  constructor(game: Game) {
    super(game);
  }
}