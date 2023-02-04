import Client from "..";
import { Writer } from "../../Coder";
import Player from "../../Entity/Player/Player";
import LeaderboardEntry from "./Entry";

export default class Leaderboard
{
    public entries: LeaderboardEntry[] = [];
    private client: Client;

    constructor(client: Client)
    {
        this.client = client;
    }

    public writeBinary(writer: Writer)
    {
        writer.vu(this.entries.length);
        for (const entry of this.entries)
        {
            writer.string(entry.name);
            writer.vu(entry.score);
            writer.vu(entry.playerId);
        }        
    }

    public tick()
    {
        this.entries = [];
        const clientsWithPlayer = this.client.game.server.clients.filter(client => client.player != null);
        
        /** @ts-ignore all clients in this array have a player*/
        clientsWithPlayer.sort((a, b) => a.player.weapon.flails[0].score - b.player.weapon.flails[0].score);

        const entryCount = Math.min(9, clientsWithPlayer.length);

        for (let i = 0; i < entryCount; i++)
        {
            const player = clientsWithPlayer[i].player as Player;
            const entry = new LeaderboardEntry();
            entry.score = player.weapon.flails[0].score;
            entry.name = player.name;
            entry.playerId = player.id;
            this.entries[i] = entry;
        }
    }
}
