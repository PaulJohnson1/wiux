import Server from "./Server";
import Entity from "./Entity/Entity";
import BaseEntity from "./Entity/BaseEntity";
import Generator from "./Entity/Food/Generator";
import GameSpatialHashing from "./SpatialHashing";
import Vector from "./Vector";
import Leaderboard from "./Leaderboard";
import Minimap from "./Minimap";
import Wall from "./Entity/Wall";

export default class Game 
{
    public server: Server;

    public entities: Entity[] = [];
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
        this.size = 7500;

        const distance = 3500;
        new Generator(this).position = new Vector(-distance, -distance);
        new Generator(this).position = new Vector(-distance, distance);
        new Generator(this).position = new Vector(distance, -distance);
        new Generator(this).position = new Vector(distance, distance);
        new Generator(this, true).position = new Vector(0, 0);

        // left plus
        {
            const wall = new Wall(this);
            wall.position = new Vector(5000, 0);
            wall.width = 100;
            wall.height = 2000;
        }
        {
            const wall = new Wall(this);
            wall.position = new Vector(5000, 0);
            wall.width = 2000;
            wall.height = 100;
        }

        // right plus
        {
            const wall = new Wall(this);
            wall.position = new Vector(-5000, 0);
            wall.width = 100;
            wall.height = 2000;
        }
        {
            const wall = new Wall(this);
            wall.position = new Vector(-5000, 0);
            wall.width = 2000;
            wall.height = 100;
        }

        // walls pointing to the middle
        {
            const wall = new Wall(this);
            wall.position = new Vector(0, 4000);
            wall.width = 100;
            wall.height= 1000;
        }
        {
            const wall = new Wall(this);
            wall.position = new Vector(0, -4000);
            wall.width = 100;
            wall.height= 1000;
        }
    }

    public randomPointInMap()
    {
        return new Vector(0, 0).movePointByAngle(Math.random() * this.size, Math.random() * Math.PI * 2);
    }

    public findSpawnPosition()
    {
        // 200 attempts.
        let furthestPosition = this.randomPointInMap();
        for (let i = 0; i < 200; i++)
        {
            const attemptedPosition = this.randomPointInMap();
            const entitiesNear = this.spatialHashing.queryRaw(attemptedPosition.x, attemptedPosition.y, 2000, 2000).filter(e => e.distanceToPoint(attemptedPosition) < 2000);
            if (entitiesNear.length === 0)
                return attemptedPosition;
            let closestEntity = entitiesNear[0];
            for (const entity of entitiesNear)
                if (entity.distanceBetween(closestEntity) < closestEntity.distanceToPoint(attemptedPosition))
                    closestEntity = entity;

            if (closestEntity.distanceToPoint(attemptedPosition) > furthestPosition.distance(attemptedPosition))
                furthestPosition = attemptedPosition;
        }

        return furthestPosition;
    }

    tick() 
    {
        this.tickCount++;
        this.spatialHashing.clear();

        this.entities.forEach(entity => 
        {
            if (!(entity instanceof BaseEntity)) return;
            if (!entity.sentToClient) return; // has to be in the collision manager to be sent

            this.spatialHashing.insert(entity);
        });

        this.entities.forEach(entity => entity.tick());

        if ((this.tickCount & 3) === 3)
            this.leaderboard.tick();
        if ((this.tickCount & 7) === 7)
            this.minimap.tick();
    }
}
