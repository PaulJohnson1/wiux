import { Writer } from "../Coder";
import Game from "../Game";
import { constrain } from "../util";
import Vector from "../Vector";
import BaseEntity from "./BaseEntity";

export default class Wall extends BaseEntity
{
    public width: number;
    public height: number;

    constructor(game: Game)
    {
        super(game);
        this.width = 200;
        this.height = 100;
        this.size = 100; // test
        this.resistance = 0;
        this.knockback = 8;
        this.onMinimap = true;
        this.collides = true;
        this.detectsCollision = true;
        this.isWall = true;
    }

    writeBinary(writer: Writer, isCreation: boolean)
    {
        if (isCreation)
        {
            writer.vu(3); // wall type
            writer.vu(this.width);
            writer.vu(this.height);
            writer.vi(this.position.x);
            writer.vi(this.position.y);
        }
    }

    collideWith(entity: BaseEntity)
    {
        // delta to the closest pixel of the rectangle to the circle
        const delta = entity.position.subtract(this.position);
        const angle = delta.dir;

        const a = Math.cos(angle) / this.width;
        const b = Math.sin(angle) / this.height;

        const kb = (x: number) => entity.applyAcceleration(x, this.knockback / entity.resistance);

        if (Math.abs(a) <= Math.abs(b))
        {
            if (b < 0)
            {
                entity.position.y = this.position.y - this.height / 2 - entity.size - 1;
                kb(Math.PI * 3 / 2);
            }
            else
            {
                entity.position.y = this.position.y + this.height / 2 + entity.size + 1;
                kb(Math.PI / 2);
            }
        }
        else
        {
            if (a < 0)
            {
                entity.position.x = this.position.x - this.width / 2 - entity.size - 1;
                kb(Math.PI);
            }
            else
            {
                entity.position.x = this.position.x + this.width / 2 + entity.size + 1;
                kb(0);
            }
        }
    }

    protected findCollisions()
    {
        const possibleCollisions = this.findCollisionCandidates();
        const found: BaseEntity[] = [];

        for (const entity of possibleCollisions)
        {
            if (entity === this) continue;
            if (entity.isWall) continue;

            const delta = new Vector(
                constrain(entity.position.x, this.position.x - this.width / 2, this.position.x + this.width / 2),
                constrain(entity.position.y, this.position.y - this.height / 2, this.position.y + this.height / 2),
            ).subtract(entity.position);

            if (delta.x * delta.x + delta.y * delta.y > entity.size * entity.size) continue;

            found.push(entity);
        }

        return found;
    }
}
