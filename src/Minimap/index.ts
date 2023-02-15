import { Writer } from "../Coder";
import { ClientboundPacketId } from "../Constants";
import BaseEntity from "../Entity/BaseEntity";
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
            packet.vu(object.color);
            packet.vu(object.size);
        }

        const clientsWithPlayer = this.game.server.clients.filter(client => client.player != null);
        for (const client of clientsWithPlayer)
            client.sendPacket(packet.write());
    }

    public tick() {
        this.objects = [];
        for (const entity of this.game.entities) {
            if (!(entity instanceof BaseEntity))
                continue;
            if (entity.size < 50)
                continue;

            const object = new MapObject();
            this.objects.push(object)
            object.size = entity.size
            object.color = entity.color;
            object.position = entity.position.scale(-127 / this.game.size);
        }

        this.broadcastToClients();
    }
}