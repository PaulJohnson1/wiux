export default class Stat
{
    public value: number = 0;
    public max: number = 10;
    private onUpgrade: (stat: Stat) => any;

    constructor(onUpgrade: (stat: Stat) => any)
    {
        this.onUpgrade = onUpgrade;
    }

    public upgrade()
    {
        if (this.value + 1 > this.max)
            return;
            
        this.value++;
        this.onUpgrade(this);
    }

    public reset()
    {
        this.value = 0;
    }
}
