import BaseEntity from "../../BaseEntity";
import Game from "../../../Game";
import Rope from "./Rope";

export default class RopeSegment extends BaseEntity 
{
    public owner: Rope;

    constructor(game: Game, owner: Rope) 
    {
        super(game);


        this.isAffectedByRope = true;
        this.collides = false;
        this.detectsCollision = false;
        this.sentToClient = false;
        this.isAffectedByWind = false;
        this.owner = owner;

        this.position = this.owner.position;
    }

    public tick(tick: number)
    {
        super.tick(tick);
    }
}
