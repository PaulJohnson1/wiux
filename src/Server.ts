import Game from "./Game";
import Client from "./Client";
import WebSocket from "ws";

export default class Server 
{
    public game: Game;
    public clients: Client[] = [];
    public ticksPerSecond: number;

    constructor() 
    {
        this.game = new Game(this);
        this.ticksPerSecond = 20;

        setInterval(() => 
        {
            this.tick();
        }, 1000 / this.ticksPerSecond);
    }

    public handleConnection(ws: WebSocket)
    {
        console.log("new player");
        const client = new Client(this.game, ws);
        ws.on("close", () =>
            client.terminateSocket());
    }

    private tick() 
    {
        // console.time("tick");
        this.game.tick();
        // console.timeEnd("tick");

        this.clients.forEach(client => client.tick());
    }
}
