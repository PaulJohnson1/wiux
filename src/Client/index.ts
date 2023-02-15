import crypto = require("crypto");
import * as WebSocket from "ws";
import Game from "../Game";
import Player from "../Entity/Player/Player";
import Vector from "../Vector";
import BaseEntity from "../Entity/BaseEntity";
import { Writer, Reader } from "../Coder";
import { PlayerInputs } from "../types";
import { getBaseLog } from "../util";
import Stats from "./Stats";
import Stat from "./Stat";
import { ClientboundPacketId } from "../Constants";

const hash = (str: string) => crypto.createHash("sha256").update(str).digest("hex");

export default class Client 
{
    public socket: WebSocket;
    public inputs: PlayerInputs;
    public game: Game;
    public player: Player | null;
    public view: BaseEntity[] = [];
    public stats: Stats;
    public playerSpeed: number;
    public authenticated: boolean;
    private authKey: string;
    private wantedAuth: string;
    private sentAuth: boolean;

    constructor(game: Game, socket: WebSocket) 
    {
        this.game = game;

        this.authenticated = false;
        this.authKey = crypto.randomBytes(100).toString("hex");
        this.wantedAuth = hash(this.authKey);
        this.sentAuth = false;
        this.player = null;
        this.stats = new Stats([
            new Stat(stat => this.player?.weapon.flails.forEach(flail => flail.knockback /= 0.9)),
            new Stat(stat => this.player?.weapon.flails.forEach(flail => flail.resistance *= 0.9)),
            new Stat(stat => this.player?.weapon.flails.forEach(flail => flail.friction **= 0.95)),
            new Stat(stat => this.player?.weapon.ropes.forEach(rope => rope.k += 0.001)),
            new Stat(stat => this.player?.weapon.ropes.forEach(rope => rope.restLength += 15)),
            new Stat(stat => this.playerSpeed += 0.003)
        ]);
        this.playerSpeed = 0;
        this.inputs = { angle: 0, distance: 0, mousePressed: false };
        this.socket = socket;

        this.sendInit();
        this.requestAuth();

        this.socket.on("message", data => 
        {
            const reader = new Reader(data as Buffer);
            const packetType = reader.vu();

            if (packetType === 0) 
            {
                this.inputs.mousePressed = !!reader.vu();
                this.inputs.angle = reader.vi() / 64;
                this.inputs.distance = reader.vu();
            }
            else if (packetType === 1) 
            {
                if (!this.authenticated) return;
                if (this.player != null) return;
        
                const name = reader.string().substring(0, 50);
                this.player = new Player(this.game, name, this);
                this.stats.reset();
                this.playerSpeed = 0.07;
                this.updateStats();
                this.sendPlayerId();
            }
            else if (packetType === 2) 
            {
                if (this.player == null) return;

                const id = reader.vu();

                if (this.stats.getStat(id) == null) return;
                const stat = this.stats.getStat(id);

                if (stat.value >= stat.max) return;

                // https://www.desmos.com/calculator/7zrxbkgeqp graph of statsAvailable. y = stats, x = flail size
                const statsAvailable = 1.5 * getBaseLog(this.player.weapon.flails[0].size / 23, 1.12);
                const statsUsed = this.stats.statsUsed;

                if (statsUsed >= statsAvailable) return;
        
                stat.upgrade();
                this.updateStats();
            }
            else if (packetType === 3) 
            {
                if (this.sentAuth) return;

                this.sentAuth = true;
                const recievedAuth = reader.string();
                if (recievedAuth !== this.wantedAuth) 
                {
                    console.log("auth fail");
                    return this.terminateSocket();
                }

                console.log("successful auth");
                this.authenticated = true;

                this.game.server.clients.push(this);
            }
        });
    }

    private requestAuth() 
    {
        this.authenticated = false;
        const writer = new Writer();
        writer.vu(ClientboundPacketId.AuthRequested);
        writer.string(this.authKey);

        this.sendPacket(writer.write());
    }

    private updateStats() 
    {
        const writer = new Writer();
        writer.vu(ClientboundPacketId.Stats);
        this.stats.writeBinary(writer);
        writer.vu(this.stats.statsUsed);

        this.sendPacket(writer.write())
    }

    private sendInit() 
    {
        const writer = new Writer();
        writer.vu(ClientboundPacketId.Initial);

        writer.vu(this.game.size);

        this.sendPacket(writer.write())
    }

    private sendPlayerId() 
    {
        if (this.player == null) throw new Error("cannot write player id");

        const writer = new Writer();
        writer.vu(ClientboundPacketId.PlayerId);
        writer.vu(this.player.id);
        this.sendPacket(writer.write())
    }

    private sendUpdate() 
    {
        const writer = new Writer();

        writer.vu(ClientboundPacketId.Update);

        const entitiesInView = this.game.spatialHashing.query({
            position: this.player != null ? this.player.position : new Vector(0, 0),
            size: 1900,
        } as BaseEntity /** risky */);

        if (this.player != null)
            if (entitiesInView.indexOf(this.player as Player) === -1)
                entitiesInView.push(this.player as Player);

        this.view.forEach((entity) => 
        {
            if (!entity.sentToClient) return;

            if (entitiesInView.indexOf(entity) === -1) 
            {
                this.view.splice(this.view.indexOf(entity), 1);
                writer.vu(entity.id);
            }
        });

        writer.vu(0);

        entitiesInView.forEach((entity) => 
        {
            if (!entity.sentToClient) return;

            const isCreation = this.view.indexOf(entity) === -1;

            if (isCreation) this.view.push(entity);

            writer.vu(entity.id);
            writer.vu(isCreation ? 1 : 0);
            entity.writeBinary(writer, isCreation);
        });

        writer.vu(0);

        this.sendPacket(writer.write())
    }

    sendPacket(packet: ArrayBufferLike) 
    {
        this.socket.send(packet);
    }

    terminateSocket() 
    {
        this.player?.terminate();

        if (!(this.socket.readyState === WebSocket.CLOSED || this.socket.readyState === WebSocket.CLOSING))
            this.socket.close();

        this.game.server.clients.splice(this.game.server.clients.indexOf(this), 1);
    }

    tick(tick: number) 
    {
        this.sendUpdate();
        if (this.player == null) return;
        if (this.inputs.distance > 80) this.player.applyAcceleration(this.inputs.angle + Math.PI, this.playerSpeed);
        this.player.tick(tick);
    }
}
