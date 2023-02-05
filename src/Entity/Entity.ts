import Game from "../Game";
import { Writer } from "../Coder";

/**
 * Lowest level of an entity
 */
export default class Entity 
{
    public game: Game;
    public id: number;
    public sentToClient: boolean;

    constructor(game: Game) 
    {
        this.game = game;
        this.id = this.game.nextId++;

        this.sentToClient = true;

        this.game.entities.push(this);
    }

    terminate() 
    {
        this.game.entities.splice(this.game.entities.indexOf(this), 1);
    }

    writeBinary(writer: Writer, isCeation: boolean) 
    {}

    tick(tick: number) 
    {}
}
