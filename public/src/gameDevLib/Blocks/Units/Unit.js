import { Block } from '../Block.js';
import { BlockCollectionStack } from "../../BlockCollectionStack.js";

export const globalUnitCollectionStack = new BlockCollectionStack();
export let collisionCheckCount = 0;

export function resetCollisionCheckCount() {
    collisionCheckCount = 0;
}

/**
 * A unit is everything that can have collision and can be controlled
 */
export class Unit extends Block {
    constructor(ctx, x = 0, y = 0, width = 5, height = 5, collision = true, speed = 0.1, hitpoints = -1, buttonActions = {}, img, hitboxMargin = 20) {
        super(ctx, x, y, width, height, 'transparent', img);
        this.collision = collision;
        this.collisionIgnoreTypes = [];
        this.speed = speed;
        this.direction = { x: 0, y: 0 };
        this.hitpoints = hitpoints; // -1 means immortal
        this.controlActive = false; // checks if is affected by controls
        this.buttonActions = buttonActions;
        this.hitboxMargin = hitboxMargin;
        this.buttons = {};
        this.unitType = "default";
        this.drawHitbox = false;
        this.verboseCollision = false;
        this.verboseControl = false;
        this.lifeState == 'alive'; // alive, dead, dying, spawning

        this.collisionReactions = [this.defaultCollisionReaction.bind(this),
        this.bombCollisionReaction.bind(this)
        ];

        globalUnitCollectionStack.addBlock(this);

        this.collisionIgnoreTypes = ['item', 'enemy'];
    }

    bombCollisionReaction(collisionUnit) {
        if (collisionUnit.unitType == "bomb") {
            let alreadyColliding = this.wouldCollide(this._x, this._y, collisionUnit);
            if (alreadyColliding) return true;
            return false;
        }
        return true;
    }

    removeFromCollection() {
        delete globalUnitCollectionStack.globalBlockCollection()[this.key];
        super.removeFromCollection();
    }

    hitboxX() {
        return this.width * this.hitboxMargin / 100;
    }

    hitboxY() {
        return this.height * this.hitboxMargin / 100;
    }

    draw() {
        super.draw();
        if (this.drawHitbox) {
            this.ctx.beginPath();
            this.ctx.lineWidth = 2;
            this.ctx.strokeStyle = "red";
            let hbmX = this.hitboxX();
            let hbmY = this.hitboxY();

            this._x += hbmX;
            this._y += hbmY;
            this._width -= hbmX * 2;
            this._height -= hbmY * 2;
            this.ctx.rect(this.xGlobal, this.yGlobal, this.widthGlobal, this.heightGlobal);
            this.ctx.stroke();
            this._x -= hbmX;
            this._y -= hbmY;
            this._width += hbmX * 2;
            this._height += hbmY * 2;
        }
    }

    insideCollisionBox(x, y) {
        let hbmX = this.hitboxX();
        let hbmY = this.hitboxY();
        return ((x >= this._x + hbmX) &&
            (x <= (this._x + this.width - hbmX)) &&
            (y >= this._y + hbmY) &&
            (y <= (this._y + this.height - hbmY)));
    }

    wouldCollide(testX, testY, unit) {
        collisionCheckCount++;
        if (this.key == unit.key) return false;
        let hbmX = this.hitboxX();
        let hbmY = this.hitboxY();

        if (unit.insideCollisionBox(testX + hbmX, testY + hbmY)) return true;
        if (unit.insideCollisionBox(testX + this.width - hbmX, testY + hbmY)) return true;
        if (unit.insideCollisionBox(testX + this.width - hbmX, testY + this.height - hbmY)) return true;
        if (unit.insideCollisionBox(testX + hbmX, testY + this.height - hbmY)) return true;
        return false;
    }

    wouldCollideGlobal(testX, testY) {
        let collisionUnits = [];
        let units = Object.values(globalUnitCollectionStack.globalBlockCollection());
        for (let i = 0; i < units.length; i++) {
            let skip = false;
            for (let j = 0; j < this.collisionIgnoreTypes.length; j++) {
                if (units[i].unitType == this.collisionIgnoreTypes[j]) {
                    skip = true;
                    break;
                }
            }
            if (skip) continue;


            if (this.wouldCollide(testX, testY, units[i])) collisionUnits.push(units[i]);
        }
        return collisionUnits.length > 0 ? collisionUnits : false;
    }

    /**
     * A possible reaction on a collision with a specific unit type
     * 
     * @param {*} collisionUnit     Unit the current unit collided with
     * 
     * @returns     Tells whether or not the current unit should be able to keep moving in the direction of the collisionUnit
     */
    defaultCollisionReaction(collisionUnit) {
        if (collisionUnit.unitType == "default" || collisionUnit.unitType == "destructible" ||
            collisionUnit.unitType == "indestructible") return false;
        return true;
    }



    collisionReact(collisionUnits) {

        let ret = true;
        collisionUnits.forEach(collisionUnit => {
            this.collisionReactions.forEach(reaction => ret = ret && reaction(collisionUnit))
        })
        return ret;
    }

    newXY(noX = false, noY = false) {
        let newX = this._x + (noX ? 0 : this.direction.x * this.speed);
        let newY = this._y + (noY ? 0 : this.direction.y * this.speed);

        if (newX < 0 || newX > (100 - this.width) || newY < 0 || newY > (100 - this.height)) {
            if (noY) return { newX: this._x, newY: this._y };
            else if (noX) return this.newXY(false, true);
            else return this.newXY(true);
        }

        if (this.collision && this.unitType != "default") {
            let collisionUnits = this.wouldCollideGlobal(newX, newY);
            if (collisionUnits && !this.collisionReact(collisionUnits)) {
                if (noY) return { newX: this._x, newY: this._y };
                else if (noX) return this.newXY(false, true);
                else return this.newXY(true);
            }
        }
        return { newX, newY };
    }

    /**
     * Calculates new position and moves Unit there
     */
    move() {
        let newXY = this.newXY();
        this.reposition(newXY.newX, newXY.newY);
    }

    /**
     * When the player pushes one or multiple buttons the button presses get logged in an array
     * On each (Logic-)Frame this array gets checked with @control and the corresponding @buttonActions will be processed
     */
    control() {
        Object.keys(this.buttons).forEach(button => this.buttons[button] ?
            (this.buttonActions[button] ? this.buttonActions[button]() : false) :
            (this.buttonActions['not_' + button] ? this.buttonActions['not_' + button]() : false));
    }

    /**
     * see @Block
     */
    update() {
        if (this.controlActive) this.control();
        this.move();
        super.update();
    }

    /**
     * see @Block
     */
    die() {
        this.removeFromCollection();
        super.die();
    }
}