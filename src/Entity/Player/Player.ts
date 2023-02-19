import Game from "../../Game";
import BaseEntity from "../BaseEntity";
import Flail from "./Flail";
import Client from "../../Client";
import BasicFlail from "./FlailDefinitions/Basic";
import FlailDefinition from "./FlailDefinitions/BaseDefinition";
import DeathScreenStats from "../../Client/DeathScreenStats";

export default class Player extends BaseEntity 
{
    public weapon: FlailDefinition;
    public client?: Client;
    public name: string;
    public color: number;

    constructor(game: Game, name: string, client?: Client) 
    {
        super(game); 

        this.name = name;
        this.client = client;

        this.size = 10;
        this.style = 2;
        this.color = Math.random() * 360;
        this.position = this.game.findSpawnPosition();
        this.knockback = 2

        this.collides = true;
        this.detectsCollision = true;
        this.onMinimap = false;

        this.restLength = this.size;

        this.weapon = new BasicFlail(this);
    }

    terminate(killedBy?: BaseEntity) 
    {
        super.terminate(killedBy);
        this.weapon.terminate(killedBy);

        if (this.client != null)
        {
            this.client.player = null;
            if (killedBy)
                this.client.killedBy = killedBy;
            this.client.deathScreen = new DeathScreenStats(this.weapon.flails[0].score, this.weapon.flails[0].size, killedBy instanceof Flail ? killedBy.owner.name : undefined);
        }
    }

    onCollisionCallback(entity: BaseEntity) 
    {
        if (entity instanceof Flail && entity.owner !== this) 
        {
            this.terminate(entity);
        }
    }

    collideWith(entity: BaseEntity) 
    {
        if (entity.detectsCollision) this.onCollisionCallback(entity);
        if (!entity.collides || !this.collides) return;

        const delta = this.position.subtract(entity.position);
        const deltaDir = delta.dir;

        if (!(entity instanceof Flail)) this.applyAcceleration(deltaDir, entity.knockback * this.resistance);
        entity.applyAcceleration(deltaDir + Math.PI, this.knockback * entity.resistance);
    }
}
