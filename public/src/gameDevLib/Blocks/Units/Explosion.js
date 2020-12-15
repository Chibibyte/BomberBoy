import { Unit } from "./Unit.js";

/**
 * Explosion object of a Bomb
 * When a Bomb "explodes" the Bomb-object disappears and an Explosion
 * object is generated.
 */
export class Explosion extends Unit {
    /**
     *                  
     * @param {*} ctx 
     * @param {number} explosionSize    Explosion radius on grid fields
     * @param {*} growAxis              Axis in which the explosion expands (x,y)
     */
    constructor(ctx, explosionSize = 1, growAxis = "x") {
        super(ctx);
        this.timer = 1;
        this.explosionSize = explosionSize; 
        this.collision = false;
        this.growAxis = growAxis;
        this.img = "res/fireball.png";
        this.centerImg = "res/fireballCenter.png";
        this.centerImage = new Image(this.widthGlobal, this.heightGlobal);
        this.centerImage.src = this.centerImg;

        this.unitType = "explosion";
        this.hitboxMargin = 5;

        this.fireout = false;
        this.timeout = setTimeout(() => {
            this.fireout = true;

        }, this.timer * 1000)
    }

    /**
     * Saves the current position and size information.
     * Usefull before changes (e.g. @grow function)
     */
    storeOrigData() {
        this.originalWidth = this._width;
        this.originalHeight = this._height;
        this.originalX = this._x;
        this.originalY = this._y;
    }

    /**
     * See @Block
     */
    draw() {
        super.draw();

        let width = this.globalWidth(this.originalWidth);
        let height = this.globalHeight(this.originalHeight);
        let x = this.globalX(this.originalX);
        let y = this.globalY(this.originalY);
        this.ctx.drawImage(this.centerImage, x, y, width, height);
    }

    /**
     * lets the explosion grow from @from to @to
     * 
     * 
     * @param {object} from     {x,y} start coordinates for explosion
     */
    grow(from, reducedExplSize) {
        let growDir = (this.growAxis == 'x') ? 'width' : 'height';
        let dirSize = this[growDir];
        this[growDir] = dirSize * (reducedExplSize + 1);
        this[`_${this.growAxis}`] = from;
    }


}