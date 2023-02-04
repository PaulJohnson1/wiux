import Game from "../Game";
import Vector from "../Vector";
import Entity from "./Entity";
import { Writer } from "../Coder";

/**
 * An entity that is visible and has physics
 */
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

    protected constructor(game: Game) 
    {
        super(game);

        this.position = Vector.fromPolar(Math.random() * 7, (Math.random() * Math.sqrt(this.game.size)) ** 2);
        this.velocity = new Vector(0, 0);

        this.name = "";

        this.color = 0;
        this.style = 0;
        this.size = 0;
        this.friction = 0.85;
        this.restLength = 0;
        this.knockback = 0.1;
        this.resistance = 1;
        this.windDirection = 0;

        this.collides = false;
        this.detectsCollision = false;
        this.isAffectedByRope = false;
        this.isAffectedByWind = false;
        this.onMinimap = false;
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
        this.applyAcceleration(this.position.dir, (-mag + this.size) / 30000)
    }

    collideWith(entities: Set<BaseEntity>) 
    {
        entities.forEach((entity: BaseEntity) => 
        {
            if (entity.detectsCollision) this.onCollisionCallback(entity);

            if (!entity.collides || !this.collides) return;
            const delta = this.position.subtract(entity.position);
            const deltaDir = delta.dir;

            this.applyAcceleration(deltaDir, entity.knockback * this.resistance);
            entity.applyAcceleration(deltaDir + Math.PI, this.knockback * entity.resistance);
        });
    }

    private findCollisions() 
    {
        const possibleCollisions = this.findCollisionCandidates();
        const found = new Set<BaseEntity>();

        possibleCollisions.forEach(entity => 
        {
            const collisionRadius = this.size + entity.size;
            const delta = entity.position.subtract(this.position);

            if (delta.x ** 2 + delta.y ** 2 < collisionRadius ** 2) found.add(entity); 
        })

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

    tick(tick: number) 
    {
        super.tick(tick);

        this.collideWith(this.findCollisions());

        this.velocity = this.velocity.scale(this.friction);
        this.position = this.position.add(this.velocity.scale(this.game.server.deltaTick));

        const mag = this.position.x ** 2 + this.position.y ** 2;

        if (mag > (this.game.size - this.size) ** 2) 
        {
            this.onBorderCollisionCallback(Math.sqrt(mag))
        }

        if (this.isAffectedByWind) 
        {
            this.windDirection += Math.random() * 0.05 - 0.048;
            this.velocity = this.velocity.add(Vector.fromPolar(this.windDirection, 0.01));
        }
    }
}
