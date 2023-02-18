// https://github.com/cx88/diepssect/blob/master/diep-bot/coder.js
const convo = new ArrayBuffer(4);
const u8 = new Uint8Array(convo);
const i32 = new Uint32Array(convo);
const float = new Float32Array(convo);

export const endianSwap = val =>
  ((val & 0xff) << 24)
  | ((val & 0xff00) << 8)
  | ((val >> 8) & 0xff00)
  | ((val >> 24) & 0xff);

export class Writer {
  constructor() {
    this.length = 0
    this.buffer = new Uint8Array(4096)
  }
  i8(num) {
    this.buffer[this.length] = num
    this.length += 1
    return this
  }
  i32(num) {
    i32[0] = num
    this.buffer.set(u8, this.length)
    this.length += 4
    return this
  }
  float(num) {
    float[0] = num
    this.buffer.set(u8, this.length)
    this.length += 4
    return this
  }
  vu(num) {
    do {
      let part = num
      num >>>= 7
      if (num) part |= 0x80
      this.buffer[this.length++] = part
    } while (num)
    return this
  }
  vi(num) {
    const sign = (num & 0x80000000) >>> 31
    if (sign) num = ~num
    const part = (num << 1) | sign
    this.vu(part)
    return this
  }
  vf(num) {
    float[0] = num
    this.vi(endianSwap(i32[0]))
    return this
  }
  string(str) {
    const bytes = new TextEncoder().encode(str)
    this.buffer.set(bytes, this.length)
    this.length += bytes.length
    this.buffer[this.length++] = 0
    return this
  }
  write() {
    return this.buffer.buffer.slice(0, this.length)
  }
  dump() {
    return Array.from(this.buffer.subarray(0, this.length)).map(r => r.toString(16).padStart(2, 0)).join(' ')
  }
}

export class Reader {
  constructor(content) {
    this.at = 0
    this.buffer = new Uint8Array(content)
  }
  i8() {
    return this.buffer[this.at++]
  }
  i32() {
    u8.set(this.buffer.subarray(this.at, this.at += 4))
    return i32[0]
  }
  float() {
    u8.set(this.buffer.subarray(this.at, this.at += 4))
    return float[0]
  }
  vu() {
    let out = 0
    let at = 0
    while (this.buffer[this.at] & 0x80) {
      out |= (this.buffer[this.at++] & 0x7f) << at
      at += 7
    }
    out |= this.buffer[this.at++] << at
    return out
  }
  vi() {
    let out = this.vu()
    const sign = out & 1
    out >>= 1
    if (sign) out = ~out
    return out
  }
  vf() {
    i32[0] = endianSwap(this.vi())
    return float[0]
  }
  string() {
    let at = this.at
    while (this.buffer[this.at]) this.at++
    return new TextDecoder().decode(this.buffer.subarray(at, this.at++)).toString()
  }
  write() {
    let slice = this.buffer.slice(this.at)
    this.at += slice.length
    return slice
  }
}