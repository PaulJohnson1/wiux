import BaseEntity from "./Entity/BaseEntity";
import Wall from "./Entity/Wall";

export default class SpatialHashing 
{
    private hashMap = new Map<number, BaseEntity[]>();
    private queryId = 0;

    clear() 
    {
        this.hashMap = new Map();
    }

    insert(entity: BaseEntity) 
    {
        const x = entity.position.x;
        const y = entity.position.y;
        const w = entity instanceof Wall ? entity.width : entity.size;
        const h = entity instanceof Wall ? entity.height : entity.size;
        const startX = (x - w) >> 6;
        const startY = (y - h) >> 6;
        const endX = (x + w) >> 6;
        const endY = (y + h) >> 6;

        for (let x = startX; x <= endX; x++)
            for (let y = startY; y <= endY; y++)
            {
                const key = (x * 73856093) ^ (y * 19349663);
                if (!this.hashMap.has(key))
                    this.hashMap.set(key, [entity]);
                else
                /** @ts-ignore */
                    this.hashMap.get(key).push(entity);
            }
    }

    queryRaw(x: number, y: number, w: number, h: number)
    {
        const result: BaseEntity[] = [];

        const startX = (x - w) >> 6;
        const startY = (y - h) >> 6;
        const endX = (x + w) >> 6;
        const endY = (y + h) >> 6;

        for (let x = startX; x <= endX; x++)
            for (let y = startY; y <= endY; y++)
            {
                const key = (x * 73856093) ^ (y * 19349663);
                const cell = this.hashMap.get(key);
                if (cell === undefined) continue;
                for (let i = 0; i < cell.length; i++) 
                {
                    if (cell[i].queryId != this.queryId) 
                    {
                        cell[i].queryId = this.queryId;
                        result.push(cell[i]);
                    }
                }
            }

        // Force uint32 to prevent the queryId from going too high for javascript to handle.
        this.queryId = (this.queryId + 1) >>> 0;

        return result;
    }

    query(entity: BaseEntity): BaseEntity[] 
    {
        if (entity instanceof Wall) return this.queryRaw(entity.position.x, entity.position.y, entity.width, entity.height)
        return this.queryRaw(entity.position.x, entity.position.y, entity.size, entity.size);
    }
}
