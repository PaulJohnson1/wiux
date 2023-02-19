import { Writer } from "../Coder";

export default class DeathScreenStats
{
    public name: string;
    public score: number;
    public flailSize: number;

    constructor(score: number, flailSize: number, name?: string)
    {
        this.name = name || "Unknown Entity";
        this.score = score;
        this.flailSize = flailSize
    }

    public writeBinary(writer: Writer)
    {
        writer.string(this.name);
        writer.vu(this.score);
        writer.vu(this.flailSize);
    }
}
