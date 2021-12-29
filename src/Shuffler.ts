const Module = require("../Shuffler/wasm/shuffler.wasm.js");

class Shuffler {
  static shuffle(packet: ArrayBufferLike) {
    const u8 = new Uint8Array(packet);

    Module.HEAPU8.set(new Uint8Array([...u8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]), 15000000);

    Module.shuffle(15000000, 16777212, u8.length);

    return Module.HEAPU8.slice(15000000, 15000000 + Module.HEAP32[16777212 >> 2]);
  }

  static unshuffle(packet: ArrayBufferLike) {
    const u8 = new Uint8Array(packet);

    Module.HEAPU8.set(new Uint8Array([...u8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]), 15000000);

    Module.unshuffle(1500000, u8.length);

    return Module.HEAPU8.slice(15000000, 15000000 + u8.length);
  }
}

export default Shuffler;
