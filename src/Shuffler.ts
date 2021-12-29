const Module = require("../Shuffler/wasm/shuffler.wasm.js");

class Shuffler {
  static shuffle(packet: ArrayBufferLike) {
    const u8 = new Uint8Array(packet);

    Module.HEAPU8.set(new Uint8Array([...u8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]));

    Module.shuffle(0, 16777212, u8.length);

    return Module.HEAPU8.slice(0, Module.HEAP32[16777212 >> 2]);
  }

  static unshuffle(packet: ArrayBufferLike) {
    const u8 = new Uint8Array(packet);

    Module.HEAPU8.set(new Uint8Array([...u8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]));

    Module.unshuffle(0, u8.length);

    return Module.HEAPU8.slice(0, u8.length);
  }
}

export default Shuffler;
