import * as WebSocket from "ws";
import Server from "./Server";

const wss = new WebSocket.Server({ port: 1234 });

const server = new Server(wss);

console.log("running");
