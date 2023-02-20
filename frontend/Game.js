import { Reader, Writer } from "./Coder.js";
import Circle from "./Entity/Circle.js";
import Wall from "./Entity/Wall.js";
import MinimapEntity from "./Entity/MinimapEntity.js";
import Rope from "./Entity/Rope.js";
import Upgrade from "./Gui/Upgrade.js";
import Leaderboard, { LeaderboardEntry } from "./Gui/Leaderboard.js";
import literally_nothing from "./sha256.js";
import { lerp } from "./util.js";

const gridImage = new Image();
gridImage.src = "/Sprites/grid.png";

CanvasRenderingContext2D.prototype.fillRoundRect = function (
  x,
  y,
  width,
  height,
  r
) {
  const ctx = this;
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + width - r, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + r);
  ctx.lineTo(x + width, y + height - r);
  ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  ctx.lineTo(x + r, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
  ctx.fill();
};

class DeathStats
{
  constructor(name, score, size)
  {
    this.score = score;
    this.size = size;
    this.name = name;
  }
}

export default class Game {
  constructor(canvas, elements, socket) {
    this.canvas = canvas;
    this.elements = elements;
    this.inGame = false;

    this.ctx = canvas.getContext("2d");

    this.connectionTimeout = setTimeout(() => location.reload(), 7_000)

    this.socket = socket;

    this.socket.binaryType = "arraybuffer";
    this.socket.bitsRecieved = 0;
    this.socket.packetsRecieved = 0;
    this.nextUpgradeId = 0;
    this.leaderboard = new Leaderboard(this);
    this.fps = 60;
    this.deathStats = null;

    this.framesSinceLastTick = 0;

    this.averageMillisecondsPerTick = [20];

    this.lastFrameTime = performance.now() - 1;
    this.lastTickTime = performance.now() - 1;

    this.mouse = {};

    this.camera = {
      x: 0,
      y: 0
    }

    this.cameraDestination = {
      x: 0,
      y: 0,
    }

    this.fov = 1;
    this.fovDestination = 1;

    this.upgrades = [
      new Upgrade(this, 25, 50 * 0 + 25, "Flail Knockback", 10),
      new Upgrade(this, 25, 50 * 1 + 25, "Speed", 10),
      new Upgrade(this, 25, 50 * 2 + 25, "Fov", 10)
    ];

    this.stats = 0;

    this.world = {
      id: null,
      size: 0,
      _entities: {},
      entities: [],
      map: new Set(),
    };

    this.elements[1].onclick = () => {
      this.sendSpawn(this.elements[0].value);
    };

    this.canvas.addEventListener("mousemove", ({ clientX, clientY }) => {
      clientX -= window.innerWidth / 2;
      clientY -= window.innerHeight / 2;

      clientX *= devicePixelRatio;
      clientY *= devicePixelRatio;

      this.mouse.angle = Math.atan2(clientY, clientX);
      this.mouse.distance = Math.sqrt(clientX ** 2 + clientY ** 2);
    });

    this.canvas.addEventListener("mousedown", ({ clientX, clientY }) => {
      clientX *= devicePixelRatio;
      clientY *= devicePixelRatio;

      this.mouse.pressed = true;
    });

    this.canvas.addEventListener("mouseup", () => {
      this.mouse.pressed = false;
    });

    this.socket.addEventListener("open", () => {
      this.elements[1].innerHTML = "Join Game";
      clearTimeout(this.connectionTimeout);
    })

    this.socket.addEventListener("message", ({ data }) => {
      this.socket.bitsRecieved += new Uint8Array(data).length * 8;
      this.socket.packetsRecieved++;

      const reader = new Reader(data);

      this.parseUpdate(reader);
    });

    this.updateCamera();
  }

  get ticksPerSecond() {
    return 1 / (this.averageMillisecondsPerTick.reduce((acc, v) => acc + v, 0) / this.averageMillisecondsPerTick.length / 1000);
  }

  get framesPerTick() {
    return this.fps / this.ticksPerSecond;
  }

  updateCamera() {
    requestAnimationFrame((() => this.updateCamera()));
    this.framesSinceLastTick++;

    if (this.inGame) {
      this.render(0.5 / this.framesPerTick);
    }
 
    this.lastFrameTime = performance.now();
  }

  parseUpdate(reader) {
    const type = reader.vu();

    if (type === 1) {
      const size = reader.vu();

      this.world.size = size;
    } else if (type === 2) {
      this.inGame = true;
      this.deathStats = null;
      const id = reader.vu();

      this.world.id = id;
    } else if (type === 3) {
      for (let i = 0; i < this.upgrades.length; i++) {
        this.upgrades[i].value = reader.vu();
      }
      this.stats = reader.vu();
    } else if (type === 4) {
      const toHash = reader.string();
      const hashed = sha256(toHash);

      const writer = new Writer();
      writer.vu(3);
      writer.string(hashed);

      this.socket.send(writer.write());
    } else if (type === 5) {
      this.world.map.clear();

      const count = reader.vu();

      for (let i = 0; i < count; i++) {
        const entity = new MinimapEntity(this);
        entity.x = reader.vi();
        entity.y = reader.vi();
        entity.isWall = !!reader.vu();
        if (entity.isWall)
        {
          entity.width = reader.vu() / this.world.size * 100;
          entity.height = reader.vu() / this.world.size * 100;
        }
        else
        {
          entity.color = reader.vu();
          entity.size = Math.max(2, reader.vu() / this.world.size * 100);
        }

        this.world.map.add(entity);
      }
    } else if (type === 6) {
      const leaderboardCount = reader.vu();

      this.leaderboard.entries = [];
      for (let i = 0; i < leaderboardCount; i++) {
        const entry = new LeaderboardEntry(this);
        entry.playerId = reader.vu();
        entry.score = reader.vu();
        entry.name = reader.string();
        entry.rank = i;
        this.leaderboard.entries[i] = entry;
      }
    } else if (type === 0) {
      this.fovDestination = reader.float() * devicePixelRatio;
      this.cameraDestination.x = reader.vu();
      this.cameraDestination.y = reader.vu();

      const isDead = reader.vu();
      if (isDead)
        this.deathStats = new DeathStats(reader.string(), reader.vu(), reader.vu());

      while (true) {
        const id = reader.vu();
        if (id === 0) break;
        delete this.world._entities[id];
      }

      while (true) {
        const id = reader.vu();
        if (id === 0) break;
        const isCreation = reader.vu();

        if (isCreation) {
          let entity = null;
          const type = reader.vu();

          if (type === 1) entity = new Circle(this);
          else if (type === 2) entity = new Rope(this);
          else if (type === 3) entity = new Wall(this);

          entity.id = id;
          this.world._entities[entity.id] = entity;
        }

        this.world._entities[id].parseBinary(reader, isCreation);
      }

      this.world.entities = [];

      for (const id in this.world._entities) {
        this.world.entities.push(this.world._entities[id]);
      }

      this.tick();
    }
  }

  sendSpawn(name) {
    const writer = new Writer();
    writer.vu(1);
    writer.string(name);

    this.socket.send(writer.write());
  }

  getSSX(worldX) {
    return (this.camera.x - worldX) / this.fov + innerWidth / 2;
  }

  getSSY(worldY) {
    return (this.camera.y - worldY) / this.fov + innerHeight / 2;
  }

  render(deltaTick) {
    this.camera.x = lerp(this.camera.x, this.cameraDestination.x, deltaTick);
    this.camera.y = lerp(this.camera.y, this.cameraDestination.y, deltaTick);

    this.fov = lerp(this.fov, this.fovDestination, deltaTick);

    // clear the canvas
    this.ctx.save();
    this.ctx.fillStyle = "#333"
    this.ctx.fillRect(0, 0, innerWidth, innerHeight)
    this.ctx.restore();

    // draw the map
    this.ctx.save();
    this.ctx.fillStyle = this.deathStats ? "#5350ff20" : "#5350ff0f";
    this.ctx.arc(this.getSSX(0), this.getSSY(0), this.world.size / this.fov, 0, Math.PI * 2)
    this.ctx.fill();
    this.ctx.restore();

    // draw the grid
    const increment = gridImage.width;
    const xOffset = this.getSSX(0) % increment;
    const yOffset = this.getSSY(0) % increment;

    this.ctx.save();
    this.ctx.scale(1 / this.fov, 1 / this.fov);
    for (let x = -increment; x < (innerWidth + increment) * this.fov; x += increment) {
      for (let y = -increment; y < (innerHeight + increment) * this.fov; y += increment) {
        this.ctx.drawImage(gridImage, x + xOffset, y + yOffset);
      }
    }
    this.ctx.restore();

    // render ropes under everything else
    this.world.entities.forEach(entity => entity.rendered = false);
    this.world.entities.filter(e => e instanceof Rope).forEach(e => (e.render(deltaTick), e.rendered = true));
    this.world.entities.forEach(entity => (!entity.rendered) && (entity.render(deltaTick)));
    this.upgrades.forEach(upgrade => upgrade.render());

    this.ctx.save();
    this.ctx.fillStyle = "#3337";
    this.ctx.arc(125, innerHeight - 125, 100, 0, Math.PI * 2)
    this.ctx.fill();
    this.ctx.restore();

    this.world.map.forEach(entity => entity.render());
    this.leaderboard.render();

    if (this.deathStats)
    {
      this.ctx.save();
      this.ctx.fillStyle = "#fff";
      this.ctx.strokeStyle = "#000";
      this.ctx.font = `bold 40px Ubuntu`;
      const killedByXOffset = this.ctx.measureText("You were killed by:").width / 2;
      this.ctx.fillText("You were killed by:", innerWidth / 2 - killedByXOffset, innerHeight / 2 - 150);
      this.ctx.strokeText("You were killed by:", innerWidth / 2 - killedByXOffset, innerHeight / 2 - 150);
      this.ctx.font = "bold 20px Ubuntu";
      const killedByNameOffset = this.ctx.measureText(this.deathStats.name).width / 2;
      this.ctx.fillText(this.deathStats.name, innerWidth / 2 - killedByNameOffset, innerHeight / 2 - 120);
      this.ctx.strokeText(this.deathStats.name, innerWidth / 2 - killedByNameOffset, innerHeight / 2 - 120);
      this.ctx.restore();

      this.ctx.save();
      this.ctx.fillStyle = "#fff";
      this.ctx.strokeStyle = "#000";
      this.ctx.font = `bold 30px Ubuntu`;
      this.ctx.fillText("Score:", innerWidth / 2 - 270, innerHeight / 2 - 30);
      this.ctx.strokeText("Score:", innerWidth / 2 - 270, innerHeight / 2 - 30);
      this.ctx.fillText("Flail Size:", innerWidth / 2 - 280, innerHeight / 2 + 30);
      this.ctx.strokeText("Flail Size:", innerWidth / 2 - 280, innerHeight / 2 + 30);
      this.ctx.font = `bold 25px Ubuntu`;
      this.ctx.fillText(`${this.deathStats.score}`, innerWidth / 2 - 130, innerHeight / 2 - 30);
      this.ctx.strokeText(`${this.deathStats.score}`, innerWidth / 2 - 130, innerHeight / 2 - 30);
      this.ctx.fillText(`${this.deathStats.size}`, innerWidth / 2 - 130, innerHeight / 2 + 30);
      this.ctx.strokeText(`${this.deathStats.size}`, innerWidth / 2 - 130, innerHeight / 2 + 30);
      this.ctx.restore();

      this.ctx.save();
      this.ctx.fillStyle = "#5350ff7f";
      this.ctx.strokeStyle = "#5350ffa0";
      this.ctx.lineWidth = 4;
      this.ctx.fillRoundRect(innerWidth / 2 - 75, innerHeight / 2 + 100, 150, 40, 20);
      this.ctx.stroke();
      this.ctx.restore();

      this.ctx.save();
      this.ctx.fillStyle = "#fff";
      this.ctx.strokeStyle = "#000";
      this.ctx.font = `bold 30px Ubuntu`;
      const respawnOffset = this.ctx.measureText("Respawn").width / 2;
      this.ctx.fillText("Respawn", innerWidth / 2 - respawnOffset, innerHeight / 2 + 130);
      this.ctx.strokeText("Respawn", innerWidth / 2 - respawnOffset, innerHeight / 2 + 130);
      this.ctx.stroke();
      this.ctx.restore();

      if (!this.sloppyCodeForRespawnButtonListener)
      {
        this.sloppyCodeForRespawnButtonListener = true;
        document.addEventListener("keyup", ({ code }) =>
        {
          if (code === "Enter")
            this.sendSpawn(this.elements[0].value);
        });

        document.addEventListener("mousedown", ({ clientX, clientY }) => {
          const x = innerWidth / 2 - 75;
          const y = innerHeight / 2 + 100;
          if (
            clientX < x ||
            clientX > x + 150 ||
            clientY > y + 40 ||
            clientY < y
          ) return;
          this.sendSpawn(this.elements[0].value);
        })
      } 
    }
  }

  sendUpdate() {
    const writer = new Writer();
    writer.vu(0);
    writer.vu(this.mouse.pressed);
    writer.vi(this.mouse.angle * 64);
    writer.vi(this.mouse.distance);

    this.socket.send(writer.write());
  }

  get player() {
    return this.world._entities[this.world.id];
  }

  tick() {
    const deltaTime = performance.now() - this.lastTickTime;
    this.lastTickTime = performance.now();
    new Promise(resolve =>
      requestAnimationFrame(t1 =>
        requestAnimationFrame(t2 => resolve(1000 / (t2 - t1)))
      )
    ).then(fps => this.fps = (this.fps + fps) / 2)

    this.framesSinceLastTick = 0;

    this.averageMillisecondsPerTick.push(deltaTime);
    if (this.averageMillisecondsPerTick.length > 25) this.averageMillisecondsPerTick.shift();

    const elementsStyle = this.inGame ? "none" : "";

    this.elements.forEach((e) => (e.style.display = elementsStyle));

    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    if (this.player) {
      this.sendUpdate();
    }
  }
}
