import Player from "../Player";
import Flail from "../Flail";
import Rope from "../Rope/Rope";
import BaseEntity from "../../BaseEntity";

export default class BaseDefinition 
{
    protected owner: Player;
    public flails: Flail[];
    public ropes: Rope[];

    protected constructor(owner: Player) 
    {
        this.owner = owner;
        this.flails = [];
        this.ropes = [];
    }

    public terminate(killedBy?: BaseEntity) 
    {
        this.flails.forEach(flail => flail.terminate(killedBy));
        this.ropes.forEach(rope => rope.terminate(killedBy));
    }
}
