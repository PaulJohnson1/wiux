// this code is sloppy, go look at the neat code on the backend instead

import Game from "./Game.js";
import { RivetClient } from "https://cdn.jsdelivr.net/npm/@rivet-gg/api/dist/browser/esm/index.js";

const DEVELOPER_MODE = false;

const rivet = new RivetClient({ token: "pub_prod.eyJ0eXAiOiJKV1QiLCJhbGciOiJFZERTQSJ9.CMu9g9TaMRDL5b6W5TAaEgoQDeBzNECJSueGIuaILlZrnyIWGhQKEgoQrLbfF7W-TwGgu9MIjFWxFg.4aLKXCPZ2dpf3msG1CrKbkmWAxekQFCech7FGyvmtDfHyaPO2PvLuFmXckrMQO-Q8DUeJBhnVB087wNn25HqAg" });

(async () => {
  const res = await rivet.matchmaker.lobbies.find({ gameModes: ["default"] })
  const socket = new WebSocket(DEVELOPER_MODE ? `ws://localhost:1234` : `wss://${res.ports.default.host}/${res.player.token}`);

  const game = new Game(
    document.getElementById("canvas"),
    [
      document.getElementById("input"),
      document.getElementById("spawn"),
      document.getElementById("background"),
      document.getElementById("legal"),
    ],
    socket
  );

  window.gamething = game; // ill just remove this if scripts becomes an issue
})()