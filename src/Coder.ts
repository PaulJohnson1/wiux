// https://github.com/cx88/diepssect/blob/master/diep-bot/coder.js
const convo = new ArrayBuffer(4)
const u8 = new Uint8Array(convo)
const i32 = new Uint32Array(convo)
const float = new Float32Array(convo)

const buffer = new Uint8Array(67_108_864)

const endianSwap = (val: number) =>
    ((val & 0xff) << 24)
  | ((val & 0xff00) << 8)
  | ((val >> 8) & 0xff00)
  | ((val >> 24) & 0xff)

export class Writer 
{
    private length: number;

    constructor() 
    {
        this.length = 0
    }
    i8(num: number) 
    {
        buffer[this.length] = num
        this.length += 1
        return this
    }
    i32(num: number) 
    {
        i32[0] = num
        buffer.set(u8, this.length)
        this.length += 4
        return this
    }
    float(num: number) 
    {
        float[0] = num
        buffer.set(u8, this.length)
        this.length += 4
        return this
    }
    vu(num: number) 
    {
        do 
        {
            let part = num
            num >>>= 7
            if (num) part |= 0x80
            buffer[this.length++] = part
        } while (num)
        return this
    }
    vi(num: number) 
    {
        const sign = (num & 0x80000000) >>> 31
        if (sign) num = ~num
        const part = (num << 1) | sign
        this.vu(part)
        return this
    }
    vf(num: number) 
    {
        float[0] = num
        this.vi(endianSwap(i32[0]))
        return this
    }
    string(str: string) 
    {
        const bytes = new Uint8Array(Buffer.from(str))
        buffer.set(bytes, this.length)
        this.length += bytes.length
        buffer[this.length++] = 0
        return this
    }
    write() 
    {
        return buffer.buffer.slice(0, this.length)
    }
    dump() 
    {
        return Array.from(buffer.subarray(0, this.length)).map(r => r.toString(16).padStart(2, "0")).join(' ')
    }
}
export class Reader 
{
    private buffer: Uint8Array;
    public at: number;

    constructor(content: Buffer | ArrayBufferLike) 
    {
        this.at = 0
        this.buffer = new Uint8Array(content)
    }
    i8() 
    {
        return this.buffer[this.at++]
    }
    i32() 
    {
        u8.set(this.buffer.subarray(this.at, this.at += 4))
        return i32[0]
    }
    float() 
    {
        u8.set(this.buffer.subarray(this.at, this.at += 4))
        return float[0]
    }
    vu() 
    {
        let out = 0
        let at = 0
        while (this.buffer[this.at] & 0x80) 
        {
            out |= (this.buffer[this.at++] & 0x7f) << at
            at += 7
        }
        out |= this.buffer[this.at++] << at
        return out
    }
    vi() 
    {
        let out = this.vu()
        const sign = out & 1
        out >>= 1
        if (sign) out = ~out
        return out
    }
    vf() 
    {
        i32[0] = endianSwap(this.vi())
        return float[0]
    }
    string() 
    {
        const at = this.at
        while (this.buffer[this.at]) this.at++
        return Buffer.from(this.buffer.subarray(at, this.at++)).toString()
    }
    write() 
    {
        const slice = this.buffer.slice(this.at)
        this.at += slice.length
        return slice
    }
}
