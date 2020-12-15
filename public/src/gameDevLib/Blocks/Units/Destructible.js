import { Unit } from "./Unit.js";

/**
 * A static object that can be destroyed with explosions
 */
export class Destructible extends Unit {
    constructor(ctx, img = "res/zbush.png") {
        super(ctx);
        this.collision = false;
        this.buttonActions = {
            'LEFT': () => this.direction.x = -1,
            'RIGHT': () => this.direction.x = 1,
            'UP': () => this.direction.y = -1,
            'DOWN': () => this.direction.y = 1
        };
        this.img = img;
        this.lastPos = { x: this._x, y: this._y };

        this.unitType = "destructible";


    }
}