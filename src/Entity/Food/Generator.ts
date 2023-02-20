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
    private red: boolean;

    constructor(game: Game, red: boolean = false) 
    {
        super(game);
        this.red = red;
        this.size = red ? 300 : 200;
        this.animationSizeAddon = 0;
        this.canShootFood = true;
        this.lastHitTick = 0;
        this.hitCooldown = 5;
        this.knockback = 8;
        this.resistance = 0;
        this.style = 5;
        this.color = red ? 0 : 100;
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

        this.animationSizeAddon = this.red ? 50 : 20;
        this.lastHitTick = this.game.tickCount;

        for (let i = 0; i < 3; i++) 
        {
            const food = new Food(this.game, this.red ? 15 : 10, this.red ? 4.5 : 3);
            food.position = this.position.movePointByAngle(20 + Math.random() * 50, dir - 0.025 + Math.random() * 0.05);
        }
    }

    writeBinary(writer: Writer, isCreation: boolean) 
    {
        if (isCreation) 
        {
            writer.vu(1)
            writer.string(this.name);
            writer.vu(this.style);
            writer.vu(this.color);
        }

        writer.vi(this.position.x);
        writer.vi(this.position.y);
        writer.vu(this.size + this.animationSizeAddon);
    }

    tick() 
    {
        this.canShootFood = this.lastHitTick < this.game.tickCount - this.hitCooldown;

        this.animationSizeAddon *= 0.7;

        super.tick();
    }
}
