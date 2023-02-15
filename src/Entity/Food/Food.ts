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

        this.knockback = 0.05;
        this.resistance = 2

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

    tick(tick: number) 
    {
        super.tick(tick);
        this.score *= 0.997
        this.size *= 0.997
        if (this.size < 2 || this.score < 0.2) this.terminate();
    }
}
