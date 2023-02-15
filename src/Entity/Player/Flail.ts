import BaseEntity from "../BaseEntity";
import Game from "../../Game";
import Player from "./Player";
import Food from "../Food/Food";
import Rope from "./Rope/Rope";
import Vector from "../../Vector";

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
        this.score = 6.25;
        this.style = 1;

        this.isAffectedByRope = true;
        this.collides = true;
        this.detectsCollision = true;
        this.onMinimap = true;

        this.color = this.owner.color;
    }

    applyAcceleration(theta: number, distance: number, polar = true) 
    {
        const addedVel = polar ? Vector.fromPolar(theta, distance) : new Vector(theta, distance);

        this.velocity = this.velocity.add(addedVel.scale(1)); // eventually replace this 1 with some expression that will make the bigger flails a lot slower than the small one but not make them unmovable
    }

    terminate() 
    {
        super.terminate();

        const foodCount = this.size / 10 + 1;
        const foodScore = this.score / foodCount * 0.7;

        for (let i = 0; i < foodCount; i++) 
        {
            const food = new Food(this.game, 20 + Math.random() * 10, foodScore);

            // using polar coords in order to make the food more consentrated towards the middle
            food.position = this.position.add(Vector.fromPolar(Math.random() * 6.29, Math.random() * this.size));
        }
    }

    tick(tick: number) 
    {
        if (this.size > 50)
            this.score *= 0.998
        this.size = 20 * Math.sqrt(this.score * 3);
        this.restLength = this.size;

        super.tick(tick);
    }
}
