import { Reader, Writer } from "./Coder.js";
import Circle from "./Entity/Circle.js";
import MinimapEntity from "./Entity/MinimapEntity.js";
import Rope from "./Entity/Rope.js";
import Upgrade from "./Gui/Upgrade.js";
import Leaderboard, { LeaderboardEntry } from "./Gui/Leaderboard.js";
import literally_nothing from "./sha256.js";

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

export default class Game {
  constructor(canvas, elements, socket) {
    this.canvas = canvas;
    this.elements = elements;

    this.ctx = canvas.getContext("2d");

    this.connectionTimeout = setTimeout(() => location.reload(), 7_000)

    this.socket = socket;

    this.socket.binaryType = "arraybuffer";
    this.socket.bitsRecieved = 0;
    this.socket.packetsRecieved = 0;
    this.nextUpgradeId = 0;
    this.leaderboard = new Leaderboard(this);
    this.gridPattern = this.ctx.createPattern(gridImage, "repeat");
    this.fps = 60;

    this.framesSinceLastTick = 0;

    this.averageMillisecondsPerTick = [20];

    this.lastFrameTime = performance.now() - 1;
    this.lastTickTime = performance.now() - 1;

    this.mouse = {};

    this.camera = {
      x: 0,
      y: 0
    }

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

  get fov() {
    return (this.upgrades[2].value * 0.05 + 1) / devicePixelRatio 
  }

  updateCamera() {
    requestAnimationFrame((() => this.updateCamera()));
    this.framesSinceLastTick++;

    if (this.player) {
      this.render(0.5 / this.framesPerTick);
      this.camera.x = this.player.x;
      this.camera.y = this.player.y;
    }
 
    this.lastFrameTime = performance.now();
  }

  parseUpdate(reader) {
    const type = reader.vu();

    if (type === 1) {
      const size = reader.vu();

      this.world.size = size;
    } else if (type === 2) {
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
        const circle = new MinimapEntity(this);
        circle.x = reader.vi();
        circle.y = reader.vi();
        circle.color = reader.vu();
        circle.size = Math.max(2, reader.vu() / this.world.size * 100);

        this.world.map.add(circle);
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

  getSSX(worldX, scale = true) {
    return !scale ?
      (this.player.x - worldX) / this.fov + innerWidth / 2 :
      (this.player.x - worldX) / this.fov / devicePixelRatio + innerWidth / 2;
  }

  getSSY(worldY, scale = true) {
    return !scale ?
      (this.player.y - worldY) / this.fov + innerHeight / 2 :
      (this.player.y - worldY) / this.fov / devicePixelRatio + innerHeight / 2;
  }

  render(deltaTick) {
    // clear the canvas
    this.ctx.save();
    this.ctx.fillStyle = "#333"
    this.ctx.beginPath();
    this.ctx.rect(0, 0, innerWidth, innerHeight)
    this.ctx.closePath();
    this.ctx.fill()
    this.ctx.restore();

    // draw the map
    this.ctx.save();
    this.ctx.fillStyle = "#5350ff0f";
    this.ctx.beginPath();
    this.ctx.arc(this.getSSX(0), this.getSSY(0), this.world.size / this.fov / devicePixelRatio, 0, Math.PI * 2)
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.restore();

    // draw the grid
    const increment = gridImage.width / devicePixelRatio;

    const xOffset = this.getSSX(0) % increment;
    const yOffset = this.getSSY(0) % increment;

    this.ctx.save();
    this.ctx.fillStyle = this.gridPattern;
    this.ctx.translate(xOffset, yOffset)
    this.ctx.fillRect(-xOffset, -yOffset, innerWidth + gridImage.width, innerHeight + gridImage.width)
    this.ctx.restore();

    // render ropes under everything else
    this.world.entities.forEach(entity => entity.rendered = false);
    this.world.entities.filter(e => e instanceof Rope).forEach(e => (e.render(deltaTick), e.rendered = true));
    this.world.entities.forEach(entity => (!entity.rendered) && (entity.render(deltaTick)));
    this.upgrades.forEach(upgrade => upgrade.render());

    this.ctx.save();
    this.ctx.fillStyle = "#3337";
    this.ctx.beginPath();
    this.ctx.arc(125 / devicePixelRatio, innerHeight - 125 / devicePixelRatio, 100 / devicePixelRatio, 0, Math.PI * 2)
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.restore();
    this.world.map.forEach(entity => entity.render());
    this.leaderboard.render();
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

    const elementsStyle = this.player == null ? "" : "none";

    this.elements.forEach((e) => (e.style.display = elementsStyle));

    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    if (this.player) {
      this.sendUpdate();
    }
  }
}
