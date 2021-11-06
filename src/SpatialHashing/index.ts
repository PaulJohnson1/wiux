const spatialHash = require("./build/Release/SpatialHashing.node");

export interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
  id?: number;
};

interface RawSpatialHashing {
  insert: (x: number, y: number, w: number, h: number, id?: number) => {};
  query: (x: number, y: number, w: number, h: number, id?: number) => {};
  setCellSize: (size: number) => {};
  clear: () => {};
};

export default class SpatialHashing {
  private raw: RawSpatialHashing;


  constructor(cellSize: number) {
    this.raw = spatialHash;
    this.raw.setCellSize(cellSize);
  }

  clear() {
    this.raw.clear();
  }

  insert(box: Box) {
    this.raw.insert(box.x, box.y, box.w, box.h, box.id);
  }

  query(box: Box) {
    /** @ts-ignore shut up i told you it was an i32 array */
    const raw: Int32Array = this.raw.query(box.x, box.y, box.w, box.h, box.id);

    const boxesFound = raw.length / 5;

    const found: { [id: number]: Box } = {};

    for (let i = 0; i < boxesFound; i++) {
      const x = raw[i * 5 + 0];
      const y = raw[i * 5 + 1];
      const w = raw[i * 5 + 2];
      const h = raw[i * 5 + 3];
      const id = raw[i * 5 + 4];

      found[id] = { x, y, w, h, id };
    }

    const ret: Set<Box> = new Set();

    Object.entries(found).forEach(([key, value]) => {
      ret.add(value);
    });

    return ret;
  }
}
