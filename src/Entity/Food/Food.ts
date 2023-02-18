import BaseEntity from "../BaseEntity";
import Flail from "../Player/Flail";
import Game from "../../Game";

export default class Food extends BaseEntity 
{
    public score: number;

    constructor(game: Game, size: number, score: number) 
    {
        super(game);

        this.size = size;
        this.score = score;

        this.knockback = 1;
        this.resistance = 5

        this.collides = true;
        this.detectsCollision = true;
        this.isAffectedByWind = true;
        this.onMinimap = false;

        this.color = Math.random() * 360;
    }

    onCollisionCallback(entity: BaseEntity) 
    {
        if (!(entity instanceof Flail)) return;

        entity.score += this.score;
        this.terminate();
    }

    tick() 
    {
        super.tick();
    }
}
