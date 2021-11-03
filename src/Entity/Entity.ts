import Game from "../Game";

/**
 * Lowest level of an entity
 */
export default class Entity {
  public game: Game;

  constructor(game: Game) {
    this.game = game;

    this.game.entities.add(this);
  }

  tick(tick: number) {
    
  }
}
