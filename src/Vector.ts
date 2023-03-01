export default class Vector 
{
    public x: number;
    public y: number;

    constructor(x: number, y: number) 
    {
        this.x = x;
        this.y = y;
    }

    static fromPolar(theta: number, distance: number) 
    {
        return new Vector(
            distance * Math.cos(theta),
            distance * Math.sin(theta)
        );
    }

    add(vector: Vector) 
    {
        return new Vector(this.x + vector.x, this.y + vector.y);
    }

    subtract(vector: Vector) 
    {
        return new Vector(this.x - vector.x, this.y - vector.y);
    }

    scale(scalar: number) 
    {
        return new Vector(this.x * scalar, this.y * scalar);
    }

    distance(vector: Vector) 
    {
        const subtracted = this.subtract(vector);
        return Math.sqrt(Math.pow(subtracted.x, 2) + Math.pow(subtracted.y, 2)); // math.pow(a, b) is faster than a ** b but makes the code less readable
    }

    distanceSquared(vector: Vector)
    {
        const delta = this.subtract(vector);
        return delta.x * delta.x + delta.y * delta.y;
    }

    dot(vector: Vector) 
    {
        return this.x * vector.x + this.y * vector.y;
    }

    movePointByAngle(distance: number, angle: number) 
    {
        const vec = new Vector(
            distance * Math.cos(angle),
            distance * Math.sin(angle)
        );

        return this.add(vec);
    }

    get mag() 
    {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    get magSquared() 
    {
        return this.x * this.x + this.y * this.y;
    }

    get dir() 
    {
        return Math.atan2(this.y, this.x);
    }

    get unitVector() 
    {
        const mag = this.mag;

        return new Vector((this.x / mag) || 0, (this.y / mag) || 0);
    }
}