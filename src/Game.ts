import Server from "./Server";
import Entity from "./Entity/Entity";
import BaseEntity from "./Entity/BaseEntity";
import Generator from "./Entity/Food/Generator";
import GameSpatialHashing from "./SpatialHashing";
import Vector from "./Vector";
import Leaderboard from "./Leaderboard";
import Minimap from "./Minimap";

export default class Game 
{
    public server: Server;

    public entities: Entity[] = [];
    public generators: Generator[] = [];
    public tickCount: number;
    public nextId: number;
    public size: number;
    public spatialHashing: GameSpatialHashing;
    public leaderboard: Leaderboard;
    public minimap: Minimap;

    constructor(server: Server) 
    {
        this.server = server;

        this.nextId = 1; // this `1` is needed since entities are null terminated in the protocol
        this.tickCount = 0;
        this.spatialHashing = new GameSpatialHashing();
        this.leaderboard = new Leaderboard(this);
        this.minimap = new Minimap(this);
        this.generators = [];
        this.size = 15000;

        const generators = 17;
        for (let i = 0; i < generators; i++) 
        {
            const generator = new Generator(this);
            generator.position = Vector.fromPolar(Math.random() * 6, Math.random() * this.size);
        }

        const generator = new Generator(this, true);
        generator.position = new Vector(0, 0);
    }

    tick(tick: number) 
    {
        this.spatialHashing.clear();

        this.entities.forEach(entity => 
        {
            if (!(entity instanceof BaseEntity)) return;
            if (!entity.sentToClient) return; // has to be in the collision manager to be sent

            this.spatialHashing.insert(entity);
        });

        this.entities.forEach(entity => entity.tick(tick));

        if ((tick & 4) === 4)
            this.leaderboard.tick();
        if ((tick & 8) === 8)
            this.minimap.tick();
    }
}
