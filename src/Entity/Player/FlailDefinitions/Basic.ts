import BaseDefinition from "./BaseDefinition";
import Rope from "../Rope/Rope";
import Flail from "../Flail";
import Player from "../Player";

export default class BasicFlail extends BaseDefinition 
{
    constructor(owner: Player) 
    {
        super(owner);

        this.flails[0] = new Flail(this.owner.game, this.owner);
        this.ropes[0] = new Rope(
            this.owner.game,
            this.owner,
            this.flails[0],
            3,
            0.009,
            20
        );
    }
}
