import Game from "../Game";

export default class BaseEntity {
  public game: Game;

  constructor(game: Game) {
    this.game = game;
  }
}