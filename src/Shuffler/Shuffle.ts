class Shuffler {
  getRandom(packet: ArrayBufferLike) {
    /** @ts-ignore */
    const _this = this as Client;
  
    const u8 = new Uint8Array(packet);

    _this.game.HEAPU8.set(u8);

    _this.game.wasm.instance.exports.getRandom(0, u8.length, _this.shufflingPointer);

    return _this.game.HEAPU8.slice(0, u8.length);
  }
}

export default Shuffler;