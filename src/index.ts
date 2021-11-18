import * as WebSocket from "ws";
import Server from "./Server";
import * as readline from "readline";
import { stdin as input, stdout as output } from "process";

const rl = readline.createInterface({ input, output });

rl.on("line", line => {
  try {
    console.log(eval(line));
  } catch (error) {
    /** @ts-ignore */
    console.error(`${error.message}\n\n${error.stack}`)
  }
});

const wss = new WebSocket.Server({ port: 1234 });

const server = new Server(wss);

console.log("running");
