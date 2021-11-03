import Game from "../Game";

export default class Entity {
  public game: Game;

  constructor(game: Game) {
    this.game = game;
  }

  tick(tick: number) {
    
  }
}