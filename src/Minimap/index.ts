import { Writer } from "../Coder";
import { ClientboundPacketId } from "../Constants";
import BaseEntity from "../Entity/BaseEntity";
import Wall from "../Entity/Wall";
import Game from "../Game";
import MapObject from "./MapObject";

export default class Minimap {
    private game: Game;
    public objects: MapObject[] = [];

    constructor(game: Game) {
        this.game = game;
    }

    public broadcastToClients()
    {
        const packet = new Writer();
        packet.vu(ClientboundPacketId.Minimap);
        packet.vu(this.objects.length);

        for (const object of this.objects)
        {
            packet.vi(object.position.x);
            packet.vi(object.position.y);
            packet.vu(+object.isRectangle);
            if (object.isRectangle)
            {
                packet.vu(object.width);
                packet.vu(object.height);
                continue;
            }
            packet.vu(object.color);
            packet.vu(object.size);
        }

        for (const client of this.game.server.clients)
            client.sendPacket(packet.write());
    }

    public tick() {
        this.objects = [];
        for (const entity of this.game.entities) {
            if (!(entity instanceof BaseEntity))
                continue;
            if (!entity.onMinimap)
                continue;

            const object = new MapObject();
            this.objects.push(object)
            if (entity instanceof Wall)
            {
                object.isRectangle = true;
                object.height = entity.height;
                object.width = entity.width;
            }
            object.size = entity.size
            object.color = entity.color;
            object.position = entity.position.scale(-127 / this.game.size);
        }

        this.broadcastToClients();
    }
}