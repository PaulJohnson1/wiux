import { Writer } from "../Coder";
import Player from "../Entity/Player/Player";
import Game from "../Game";
import LeaderboardEntry from "./Entry";
import { ClientboundPacketId } from "../Constants";

export default class Leaderboard {
    public entries: LeaderboardEntry[] = [];
    private game: Game;

    constructor(game: Game) {
        this.game = game;
    }

    public writeBinary(writer: Writer) {
        writer.vu(this.entries.length);
        for (const entry of this.entries) {
            writer.string(entry.name);
            writer.vu(entry.score);
            writer.vu(entry.playerId);
        }
    }

    public broadcastToClients() {
        const packet = new Writer();
        packet.vu(ClientboundPacketId.Leaderboard);
        packet.vu(this.entries.length);

        for (const entry of this.entries) {
            packet.vu(entry.playerId);
            packet.vu(entry.score);
            packet.string(entry.name);
        }

        const clientsWithPlayer = this.game.server.clients.filter(client => client.player != null);
        for (const client of clientsWithPlayer)
            client.sendPacket(packet.write());
    }

    public tick() {
        this.entries = [];
        const clientsWithPlayer = this.game.server.clients.filter(client => client.player != null);

        /** @ts-ignore all clients in this array have a player*/
        clientsWithPlayer.sort((a, b) => a.player.weapon.flails[0].score - b.player.weapon.flails[0].score);

        const entryCount = Math.min(9, clientsWithPlayer.length);

        for (let i = 0; i < entryCount; i++) {
            const player = clientsWithPlayer[i].player as Player;
            const entry = new LeaderboardEntry();
            entry.score = player.weapon.flails[0].score;
            entry.name = player.name;
            entry.playerId = player.id;
            this.entries[i] = entry;
        }

        this.broadcastToClients()
    }
}
