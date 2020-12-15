import { Unit } from "./Unit.js";

/**
 * A static object that can NOT be destroyed 
 */
export class Indestructible extends Unit {
    constructor(ctx) {
        super(ctx);
        this.collision = false;
        this.buttonActions = {
            'LEFT': () => this.direction.x = -1,
            'RIGHT': () => this.direction.x = 1,
            'UP': () => this.direction.y = -1,
            'DOWN': () => this.direction.y = 1
        };
        this.img = "res/zbush.png";
        this.lastPos = { x: this._x, y: this._y };

        this.unitType = "indestructible";


    }
}