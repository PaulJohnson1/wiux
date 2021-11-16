import Game from "../Game";
import BaseEntity from "../Entity/BaseEntity";

const spatialHash = require("../../build/Release/SpatialHashing.node");

interface RawSpatialHashing {
  insert(x: number, y: number, w: number, h: number, id: number): void;
  query(x: number, y: number, w: number, h: number): Int32Array;
  setCellSize(size: number): void;
  clear(): void;
};

interface AbstractEntity {
  position: {
    x: number,
    y: number
  };
  size: number;
  id?: number;
};

export default class SpatialHashing {
  private native: RawSpatialHashing;
  private game: Game | null;

  constructor(cellSize: number, game: Game | null = null) {
    this.native = spatialHash;
    this.native.setCellSize(cellSize);

    this.game = game;
  }

  clear() {
    this.native.clear();
  }

  insert(entity: AbstractEntity) {
    this.native.insert(
      entity.position.x,
      entity.position.y,
      entity.size,
      entity.size,
      entity.id as number
    );
  }

  query(entity: AbstractEntity): Int32Array | BaseEntity[] {
    const raw = this.native.query(
      entity.position.x,
      entity.position.y,
      entity.size,
      entity.size
    );

    if (this.game) {
      const foundEntities: BaseEntity[] = [];

      for (let i = 0; i < raw.length; i++) {
        foundEntities[i] = this.game._entities[raw[i]] as BaseEntity;
      }
  
      return foundEntities.filter(v => !!(v && v.position));
    }

    return raw;
  }
}

export const benchmark = (it: number) => {
  const times: number[] = [];

  class Prng {
    private seed: number
  
    constructor(seed: number) {
      this.seed = seed;
    }

    get next() {
      return (this.seed = this.seed * 347993 % 2147483647) / 2147483647;
    }
  }

  const asht = new Prng(136345);

  const test = new SpatialHashing(8, null);

  const start = Date.now();

  for (let i = 0; i < it; i++) {
    test.insert({
      position: {
        x: (asht.next - 0.5) * 29000,
        y: (asht.next - 0.5) * 29000
      },
      size: asht.next * 40 + 20
    });
  }
  const end = Date.now();

  times.push(end - start);


  const start2 = Date.now();

  for (let i = 0; i < it; i++) {
    test.query({
      position: {
        x: (asht.next - 0.5) * 29000,
        y: (asht.next - 0.5) * 29000
      },
      size: asht.next * 40 + 20
    });
  }

  const end2 = Date.now();

  times.push(end2 - start2);

  test.clear();

  return times;
};
