import { Writer } from "../../Coder";
import Game from "../../Game";
import BaseEntity from "../BaseEntity";
import Flail from "../Player/Flail";

export default class Sentinel extends BaseEntity
{
    public ticksUntilMovementBurst = 10;
    public isIdle: boolean = true;
    public idleAngle: number = Math.random();

    constructor(game: Game)
    {
        super(game);
        this.size = 20;
        this.knockback = 1;
        this.collides = true;
        this.detectsCollision = true;
    }

    writeBinary(writer: Writer, isCreation: boolean)
    {
        if (isCreation)
            writer.vu(4) // sentinel type
        writer.vi(this.position.x);
        writer.vi(this.position.y);
        writer.float(this.velocity.x);
        writer.float(this.velocity.y);
    }

    tickIdle()
    {
        this.isIdle = true;
        this.ticksUntilMovementBurst--;

        this.idleAngle += Math.random() * 0.1;

        this.applyAcceleration(this.idleAngle, this.ticksUntilMovementBurst === 0 ? 10 : 0.5, true)

        if (this.ticksUntilMovementBurst === 0)
            this.ticksUntilMovementBurst = 20;
    }

    huntTarget(entity: BaseEntity)
    {
        this.isIdle = false;
        this.ticksUntilMovementBurst--;

        const delta = entity.position.subtract(this.position);
        const theta = delta.dir;

        this.applyAcceleration(theta + Math.PI, this.ticksUntilMovementBurst === 0 ? 15 : 2, true)

        if (this.ticksUntilMovementBurst === 0)
            this.ticksUntilMovementBurst = 10;
    }

    tickAi()
    {
        const VIEWING_DISTANCE = 400;
        const nearEntities = this.game.spatialHashing.queryRaw(this.position.x, this.position.y, VIEWING_DISTANCE, VIEWING_DISTANCE)
            .filter(e => e instanceof Flail && e.distanceBetween(this) < VIEWING_DISTANCE);

        let closestEntity = nearEntities[0];
        if (closestEntity == null)
        {
            this.tickIdle();
            return;
        }

        for (const entity of nearEntities)
            if (entity.distanceBetween(this) < closestEntity.distanceBetween(this))
                closestEntity = entity;

        this.huntTarget(closestEntity);
    }

    onCollisionCallback(entity: BaseEntity)
    {
        if (!(entity instanceof Flail)) return;

        entity.score += 200;
        this.terminate();
    }

    tick()
    {
        super.tick();

        this.tickAi();
    }
}
