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
        this.knockback = 16;
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
        const closestPointOnLine = (point: Vector, start: Vector, end: Vector) =>
        {
            const atob = end.subtract(start);
            const atop = point.subtract(start);
            const len = atob.magSquared;
            let dot = atop.dot(atob)
            const t = Math.min(1, Math.max(0, dot / len));
        
            dot = ((end.x - start.x) * (point.y - start.y)) - ((end.y - start.y) * (point.x - start.x));
        
            return new Vector(start.x + (atob.x * t), start.y + (atob.y * t));
        }

        // lines that make up the rectangle
        const lines = [
            [
                new Vector(this.position.x - this.width / 2, this.position.y - this.height / 2),
                new Vector(this.position.x + this.width / 2, this.position.y - this.height / 2)
            ],
            [
                new Vector(this.position.x + this.width / 2, this.position.y - this.height / 2),
                new Vector(this.position.x + this.width / 2, this.position.y + this.height / 2)
            ],
            [
                new Vector(this.position.x + this.width / 2, this.position.y + this.height / 2),
                new Vector(this.position.x - this.width / 2, this.position.y + this.height / 2)
            ],
            [
                new Vector(this.position.x - this.width / 2, this.position.y + this.height / 2),
                new Vector(this.position.x - this.width / 2, this.position.y - this.height / 2)
            ],
        ];
        let closestLine = lines[0];
        let closestLineDistance = Infinity;
        for (const line of lines)
        {
            const closestPointToLine = closestPointOnLine(entity.position, line[0], line[1]);
            const delta = closestPointToLine.subtract(entity.position)
            if (delta.magSquared < closestLineDistance)
            {
                closestLine = line;
                closestLineDistance = delta.magSquared;
            }
        }

        const line = lines.indexOf(closestLine);
        const kb = (x: number) => entity.applyAcceleration(x, this.knockback * entity.resistance);

        switch (line)
        {
            case 0:
                entity.position.y = this.position.y - this.height / 2 - entity.size - 1;
                kb(Math.PI * 3 / 2);
            break;

            case 1:
                entity.position.x = this.position.x + this.width / 2 + entity.size + 1;
                kb(0);
            break;

            case 2:
                entity.position.y = this.position.y + this.height / 2 + entity.size + 1;
                kb(Math.PI / 2);
            break;

            case 3:
                entity.position.x = this.position.x - this.width / 2 - entity.size - 1;
                kb(Math.PI);
            break;
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
