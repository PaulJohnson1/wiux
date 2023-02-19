import Vector from "../Vector";

export default class MapObject
{
    public color: number = 0;
    public size: number = 0;
    public width: number = 0; 
    public height: number = 0;
    public isRectangle: boolean = false;
    public position: Vector = new Vector(0, 0);
}
