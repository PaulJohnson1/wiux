import * as WebSocket from "ws";
import Game from "./Game";

export default function () {
  const wss = new WebSocket.Server({ port: 1234 });

  const server = new Game(wss);
}
