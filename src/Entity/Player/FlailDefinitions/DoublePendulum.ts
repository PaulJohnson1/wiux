import BaseDefinition from "./BaseDefinition";
import Rope from "../Rope/Rope";
import Flail from "../Flail";
import Player from "../Player";

export default class DoublePendulum extends BaseDefinition 
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
            0.6,
            20
        );

        this.flails[1] = new Flail(this.owner.game, this.owner);
        this.ropes[1] = new Rope(
            this.owner.game,
            this.flails[0],
            this.flails[1],
            3,
            0.6,
            20
        );
    }
}
