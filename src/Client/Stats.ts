import { Writer } from "../Coder";
import Stat from "./Stat";

export default class Stats
{
    private stats: Stat[];
    
    constructor(stats: Stat[])
    {
        this.stats = stats;
    }

    public getStat(id: number)
    {
        return this.stats[id];
    }

    public reset()
    {
        for (const stat of this.stats)
            stat.reset();
    }

    public get statsUsed()
    {
        return this.stats.reduce((x, y) => x + y.value, 0)
    }

    public writeBinary(writer: Writer)
    {
        for (const stat of this.stats)
            writer.vu(stat.value);
    }
}
