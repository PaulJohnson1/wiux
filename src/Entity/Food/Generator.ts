import BaseEntity from "../BaseEntity";
import Food from "./Food";
import Flail from "../Player/Flail";
import Player from "../Player/Player"
import Game from "../../Game";
import { Writer } from "../../Coder";

export default class Generator extends BaseEntity 
{
    private lastHitTick: number;
    private hitCooldown: number;
    private animationSizeAddon: number;
    private canShootFood: boolean;
    private hitsUntilDeath: number;
    private diedOnTick:number;
    private spawnTick: number;
    private terminated = false;
    public red: boolean;

    constructor(game: Game, red = false) 
    {
        super(game);
        this.red = red;
        this.spawnTick = this.game.tickCount;
        this.animationSizeAddon = 0;
        this.canShootFood = true;
        this.lastHitTick = 0;
        this.hitCooldown = 2;
        this.size = red ? 400 : 200;
        this.knockback = 0.2;
        this.resistance = 0;
        this.style = 0;
        this.color = red ? 0 : 100;
        this.hitsUntilDeath = red ? 20 : 100;
        this.diedOnTick = 0;
        this.collides = true;
        this.detectsCollision = true;
        this.onMinimap = true;
    }

    onCollisionCallback(entity: BaseEntity) 
    {
        if (entity === this) return;

        const delta = entity.position.subtract(this.position);
        const dir = delta.dir + Math.PI;

        if (
            !this.canShootFood ||
      !(entity instanceof Flail || entity instanceof Player)
        ) return; 

        this.hitsUntilDeath--;

        if (this.hitsUntilDeath === 0)
            this.startDeathAnimation();

        this.animationSizeAddon = 7;
        this.lastHitTick = this.game.tickCount;

        const foodCount = entity.velocity.mag + 1;

        for (let i = 0; i < foodCount; i++) 
        {
            const rand = Math.random() * (this.red ? 4 : 1);
            const food = new Food(this.game, rand * 20 + 4, (rand * 2) ** 2);
            food.position = this.position.movePointByAngle(20 + Math.random() * 50, dir - 0.05 + Math.random() * 0.1);
        }
    }

    writeBinary(writer: Writer, isCreation: boolean) 
    {
        if (isCreation) 
        {
            writer.vu(1)
            writer.string(this.name);
            writer.vu(0);
            writer.vu(this.color);
        }

        writer.vi(this.position.x);
        writer.vi(this.position.y);
        writer.vu(this.size + this.animationSizeAddon);
    }

    private startDeathAnimation()
    {
        this.diedOnTick = this.game.tickCount;
        const foodCount = 100;
        for (let i = 0; i < foodCount; i++)
        {
            const rand = Math.random() * (this.red ? 3 : 1.5);
            const food = new Food(this.game, rand * 20 + 4, (rand * 2) ** 2);
            food.position = this.position.movePointByAngle(10, Math.PI * 2 / 100 * i);
        }
    }

    private tickDeathAnimation()
    {
        if (this.size > 50)
            this.size--;
        const ticksSinceDeath = this.game.tickCount - this.diedOnTick;
        const food = new Food(this.game, this.red ? 30 : 10, this.red ? 7 : 2);
        food.position = this.position.movePointByAngle(10, Math.PI * 2 / 100 * ticksSinceDeath);
    }

    terminate() 
    {
        if (this.terminated) return;
        new Generator(this.game, this.red);
        this.terminated = true;
        super.terminate();
    }

    tick(tick: number) 
    {
        const despawning = this.game.tickCount - this.spawnTick > 20_000;
        const despawnedThisTick = this.game.tickCount - this.spawnTick === 20_000;
        const terminatingThisTick = this.game.tickCount - this.spawnTick === 20_100;
        if (despawnedThisTick)
            this.startDeathAnimation();
        if (this.hitsUntilDeath < 0 || despawning)
            this.tickDeathAnimation();
        if ((this.hitsUntilDeath < 0 && this.game.tickCount - this.diedOnTick > 200) || terminatingThisTick)
            this.terminate();
        this.canShootFood = this.lastHitTick < tick - this.hitCooldown;

        this.animationSizeAddon *= 0.7;

        super.tick(tick);
    }
}
