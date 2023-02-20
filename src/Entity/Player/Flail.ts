import BaseEntity from "../BaseEntity";
import Game from "../../Game";
import Player from "./Player";
import Food from "../Food/Food";
import Rope from "./Rope/Rope";
import Vector from "../../Vector";
import { getBaseLog } from "../../util";

/**
 * Child of a player
 */
export default class Flail extends BaseEntity 
{
    public owner: Player;
    public score: number;
    public rope?: Rope | null;

    constructor(game: Game, owner: Player) 
    {
        super(game);
        this.owner = owner;

        this.position = this.owner.position.movePointByAngle(Math.random() * 100, Math.random() * 7);

        this.rope = null;

        this.size = 50;
        this.score = 185;
        this.style = 1;
        this.resistance = 4

        this.isAffectedByRope = true;
        this.collides = true;
        this.detectsCollision = true;
        this.onMinimap = true;

        this.color = this.owner.color;
    }

    applyAcceleration(theta: number, distance: number, polar = true) 
    {
        const addedVel = polar ? Vector.fromPolar(theta, distance) : new Vector(theta, distance);

        this.velocity = this.velocity.add(addedVel);
    }

    collideWith(entity: BaseEntity) 
    {
        if (entity.detectsCollision) this.onCollisionCallback(entity);
        if (!entity.collides || !this.collides) return;

        const delta = this.position.subtract(entity.position);
        const deltaDir = delta.dir;

        this.applyAcceleration(deltaDir, entity.knockback * this.resistance);
        if (!(entity instanceof Player) && !(entity instanceof Food)) entity.applyAcceleration(deltaDir + Math.PI, this.knockback * entity.resistance);
    }

    terminate(killedBy?: BaseEntity) 
    {
        super.terminate(killedBy);

        const foodCount = this.size / 10 + 1;
        const foodScore = Math.min(this.score, Math.sqrt(this.score / 1000) * 1000) / foodCount;

        for (let i = 0; i < foodCount; i++) 
        {
            const food = new Food(this.game, 20 + Math.random() * 10, foodScore);

            // using polar coords in order to make the food more consentrated towards the middle
            food.position = this.position.add(Vector.fromPolar(Math.random() * 6.29, Math.random() * this.size));
        }
    }

    tick() 
    {
        this.size = 100 * getBaseLog(this.score / 1000 + 1, 1.4);
        this.restLength = this.size;

        super.tick();
    }
}
