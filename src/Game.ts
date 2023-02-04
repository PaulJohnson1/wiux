import Server from "./Server";
import Entity from "./Entity/Entity";
import BaseEntity from "./Entity/BaseEntity";
import Generator from "./Entity/Food/Generator";
import GameSpatialHashing from "./SpatialHashing";
import Vector from "./Vector";
import { Writer } from "./Coder";

export default class Game 
{
    public server: Server;

    /* used for getting an entity by its id */
    public _entities: { [id: number]: Entity };
    public entities: Set<Entity>;
    public generators: Generator[] = [];
    public tickCount: number;
    public nextId: number;
    public size: number;
    public spatialHashing: GameSpatialHashing;

    constructor(server: Server) 
    {
        this.server = server;

        this.nextId = 1; // this `1` is needed since entities are null terminated in the protocol
        this.tickCount = 0;
        this.spatialHashing = new GameSpatialHashing();
        this.generators = [];
        this.entities = new Set();
        this._entities = {};
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

        this._entities = {};

        this.entities.forEach(entity => 
        {
            this._entities[entity.id] = entity;
        });

        this.entities.forEach(entity => 
        {
            if (!(entity instanceof BaseEntity)) return;
            if (!entity.sentToClient) return; // has to be in the collision manager to be sent

            this.spatialHashing.insert(entity);
        });

        this.entities.forEach(entity => entity.tick(tick));

        if (tick % this.server.ticksPerSecond === 0) 
        {
            const writer = new Writer();

            writer.vu(5);

            let count = 0;

            this.entities.forEach(entity => 
            {
                if (!(entity instanceof BaseEntity) || !entity.onMinimap) return;
                if (entity.size < 50) return;

                count++;
            });

            writer.vu(count);

            this.entities.forEach(entity => 
            {
                if (!(entity instanceof BaseEntity) || !entity.onMinimap) return;
                if (entity.size < 50) return;

                // % across the x and y axis
                writer.vi(-entity.position.x / this.size * 127);
                writer.vi(-entity.position.y / this.size * 127);
                writer.vu(entity.color);
                writer.vu(entity.size);      
            });

            const encodedMinimap = writer.write();

            this.server.clients.forEach(client => 
            {
                client.sendPacket(encodedMinimap);
            });
        }
    }
}
