import Game from "./Game";
import BaseEntity from "./BaseEntity";

export default class Player extends BaseEntity {
  constructor(game: Game) {
    super(game);
  }
} 