export class LeaderboardEntry
{
    constructor(game)
    {
        this.game = game;
        this.playerId = 0;
        this.score = 0;
        this.name = "";
        this.rank = 0;
    }

    render()
    {
        this.game.ctx.save();
        this.game.ctx.fillStyle = "#00000040";
        this.game.ctx.strokeStyle = "#000b";
        this.game.ctx.fillRoundRect(innerWidth - 300, 50 + this.rank * 40, 280, 30, 10);
        this.game.ctx.stroke();
        this.game.ctx.restore();

        const formatNumber = n => Math.floor(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        this.game.ctx.save();
        this.game.ctx.fillStyle = "#fff";
        this.game.ctx.strokeStyle = "777";
        this.game.ctx.lineWidth = 1;
        this.game.ctx.font = "bold 15px Ubuntu"
        const x = innerWidth - 280;
        const y = 70 + this.rank * 40;
        this.game.ctx.fillText(this.name || "Unnamed", x, y, 200)
        this.game.ctx.fillText("-", x + 205, y)
        this.game.ctx.fillText(formatNumber(this.score), x + 215, y);
        this.game.ctx.restore();
    }
}

export default class Leaderboard
{
    constructor(game)
    {
        this.game = game;
        this.entries = []
    }

    render()
    {
        this.entries.forEach(e => e.render());
    }
}