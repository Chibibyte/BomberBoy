import { Unit } from "./Unit.js";

/**
 * RoamingUnit
 * 
 * A unit that moves on its own (e.g. an @Enemy or an @Item )
 */
export class RoamingUnit extends Unit {
    constructor(ctx) {
        super(ctx);
        this.buttonActions = {
            'LEFT': () => this.direction.x = -1,
            'RIGHT': () => this.direction.x = 1,
            'UP': () => this.direction.y = -1,
            'DOWN': () => this.direction.y = 1
        };
        this.img = "res/fireball.png";
        this.lastPos = { x: this._x, y: this._y };
    }

    /**
     * Defines what a Unit does on each Logicframe
     */
    behaviour() {
        if (Math.abs(this.lastPos.x - this._x) < 0.1 && Math.abs(this.lastPos.y - this._y) < 0.1) {
            let rand = Math.round(Math.random() * 3);
            switch (rand) {
                case 0: this.direction = { x: 1, y: 0 }; break;
                case 1: this.direction = { x: -1, y: 0 }; break;
                case 2: this.direction = { x: 0, y: 1 }; break;
                case 3: this.direction = { x: 0, y: -1 }; break;
            }
        }
        this.lastPos.x = this._x;
        this.lastPos.y = this._y;
    }

    /**
     * see @Block
     */
    update() {
        this.behaviour();
        super.update();
    }
}