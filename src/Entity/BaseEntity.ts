import Game from "../Game";
import Vector from "../Vector";
import Entity from "./Entity";
import { Writer } from "../Coder";

export default class BaseEntity extends Entity 
{
    public position: Vector;
    public velocity: Vector;

    public name: string;

    public size: number;
    public friction: number;
    public restLength: number;
    public resistance: number;
    public knockback: number;
    public color: number;
    public style: number;
    public windDirection: number;
    public queryId = 0;

    public collides: boolean;
    public detectsCollision: boolean;
    public isAffectedByRope: boolean;
    public isAffectedByWind: boolean;
    public onMinimap: boolean;
    public isWall: boolean;

    protected constructor(game: Game) 
    {
        super(game);

        this.position = new Vector(0, 0);
        this.velocity = new Vector(0, 0);

        this.name = "";

        this.color = 0;
        this.style = 0;
        this.size = 0;
        this.friction = 0.85;
        this.restLength = 0;
        this.knockback = 10;
        this.resistance = 1;
        this.windDirection = 0;

        this.collides = false;
        this.detectsCollision = false;
        this.isAffectedByRope = false;
        this.isAffectedByWind = false;
        this.onMinimap = false;
        this.isWall = false;
    }

    get area() 
    {
        return Math.PI * this.size ** 2;
    }

    set area(v: number) 
    {
        this.size = Math.sqrt(v / Math.PI)
    }

    applyAcceleration(theta: number, distance: number, polar = true) 
    {
        const addedVel = polar ? Vector.fromPolar(theta, distance) : new Vector(theta, distance);

        this.velocity = this.velocity.add(addedVel);
    }

    writeBinary(writer: Writer, isCreation: boolean) 
    {
        if (isCreation) 
        {
            writer.vu(1); 
            writer.string(this.name);
            writer.vu(this.style);
            writer.vu(this.color);
        }
    
        writer.vi(this.position.x);
        writer.vi(this.position.y);
        writer.vu(this.size);
    }

    onCollisionCallback(entity: BaseEntity) 
    {}
  
    onBorderCollisionCallback(mag: number) 
    {
        this.applyAcceleration(this.position.dir, (-mag + this.size) / 2000)
    }

    collideWith(entity: BaseEntity) 
    {
        if (entity.detectsCollision) this.onCollisionCallback(entity);
        if (!entity.collides || !this.collides) return;
        if (entity.isWall) return;
        
        const delta = this.position.subtract(entity.position);
        const deltaDir = delta.dir;
        
        this.applyAcceleration(deltaDir, entity.knockback * this.resistance);
        entity.applyAcceleration(deltaDir + Math.PI, this.knockback * entity.resistance);
    }

    protected findCollisions() 
    {
        const possibleCollisions = this.findCollisionCandidates();
        const found: BaseEntity[] = [];

        for (const entity of possibleCollisions)
        {
            if (entity === this) continue;
            if (entity.isWall) continue;

            const delta = entity.position.subtract(this.position);
            
            const collisionRadius = this.size + entity.size;

            if (delta.x ** 2 + delta.y ** 2 < collisionRadius ** 2)
                found.push(entity); 
        }

        return found;
    }

    protected findCollisionCandidates(): BaseEntity[] 
    {
        const found: BaseEntity[] = [];

        if (!this.detectsCollision) return found;

        this.game.spatialHashing.query(this).forEach((entity: BaseEntity) => 
        {
            found.push(entity);
        });

        return found;
    }

    public distanceBetween(other: BaseEntity)
    {
        return this.position.distance(other.position) - this.size - other.size;
    }

    public distanceToPoint(point: Vector)
    {
        return this.position.distance(point) - this.size;
    }

    tick() 
    {
        super.tick();

        const collisions = this.findCollisions();
        for (const entity of collisions) this.collideWith(entity);

        this.velocity = this.velocity.scale(this.friction);
        this.position = this.position.add(this.velocity);

        const mag = this.position.x ** 2 + this.position.y ** 2;

        if (mag > (this.game.size - this.size) ** 2) 
        {
            this.onBorderCollisionCallback(Math.sqrt(mag))
        }

        if (this.isAffectedByWind) 
        {
            this.windDirection += Math.random() * 0.05 - 0.0495;
            this.velocity = this.velocity.add(Vector.fromPolar(this.windDirection, 0.5));
        }
    }
}
