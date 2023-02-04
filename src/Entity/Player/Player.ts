import Game from "../../Game";
import BaseEntity from "../BaseEntity";
import Flail from "./Flail";
import Client from "../../Client";
import BasicFlail from "./FlailDefinitions/Basic";
import FlailDefinition from "./FlailDefinitions/BaseDefinition";

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

        this.collides = true;
        this.detectsCollision = true;
        this.onMinimap = true;

        this.restLength = this.size;

        this.weapon = new BasicFlail(this);
    }

    terminate() 
    {
        super.terminate();
        this.weapon.terminate();

        if (this.client != null) this.client.player = null;
    }

    onCollisionCallback(entity: BaseEntity) 
    {
        if (entity instanceof Flail && entity.owner !== this) 
        {
            this.terminate();
        }
    }
}
