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

    public tickPhysics()
    {
        this.velocity = this.velocity.scale(this.friction);
        this.position = this.position.add(this.velocity);
    }

    public tick()
    {
        // do not call super tick because the physics for this object are managed by the owner instead of this class.
    }
}
