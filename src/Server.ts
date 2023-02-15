import Game from "./Game";
import Client from "./Client";
import { IncomingMessage } from "http";
import WebSocket from "ws";

export default class Server 
{
    public game: Game;
    public clients: Client[] = [];
    public ticksPerSecond: number;
    public deltaTick: number;

    constructor() 
    {
        this.game = new Game(this);
        this.ticksPerSecond = 20;
        this.deltaTick = 1000 / this.ticksPerSecond;

        setInterval(() => 
        {
            this.tick();
        }, 1000 / this.ticksPerSecond);
    }

    public handleConnection(ws: WebSocket, request: IncomingMessage)
    {
        console.log("new player");
        const client = new Client(this.game, ws);
        ws.on("close", () =>
            client.terminateSocket());
    }

    private tick() 
    {
        // console.time("tick");
        this.game.tick(this.game.tickCount++);
        // console.timeEnd("tick");

        this.clients.forEach(client => client.tick(this.game.tickCount));
    }
}
