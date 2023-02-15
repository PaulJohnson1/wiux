import * as WebSocket from "ws";
import Server from "./Server";
import { RivetClient } from "@rivet-gg/api";
require("dotenv").config();

const rivet = new RivetClient({ token: process.env.RIVET_TOKEN })

const wss = new WebSocket.Server({ port: 1234 });
const server = new Server()
wss.on("connection", async (ws, request) =>
{
    if (!request.url) return ws.close();
    const token = request.url.slice(1, request.url.length);
    console.log(token);

    rivet.matchmaker.players.connected({ playerToken: token }).then(() => {
        server.handleConnection(ws, request);

        ws.on("close", () => {
            rivet.matchmaker.players.disconnected({ playerToken: token }).catch(console.error);
        })
    }).catch(console.error)
})

rivet.matchmaker.lobbies.ready();
console.log("running");
