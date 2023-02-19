export const getBaseLog = (n: number, base: number) => 
{
    return Math.log(n) / Math.log(base);
};

export const constrain = (n: number, min: number, max: number) =>
{
    return n < min ? min : n > max ? max : n;
}
