
import { BlockCollectionStack } from "../BlockCollectionStack.js";

/**
 * Globally available stack of @Block collections
 * One Block collection contains all created Blocks of a @GameSlide
 */
export const globalBlockCollectionStack = new BlockCollectionStack();

/**
 * The main building block (no pun intended)
 * 
 * Everything in this micro game dev library is made of blocks (e.g. units, items, static objects and even screens)
 * 
 * Every block can be positioned and sized relative to its parent (values 0 to 100).
 * If it has no parent position and size will be relative to the canvas
 * 
 * A unique key will be created and assigned automatically and stored in the current block collection in @globalBlockCollectionStack
 */
export class Block {
    constructor(ctx, x, y, width, height, color, img, drawBorder = false, borderSize = 1, borderColor = 'red', drawCenterText = false, centerText = "Block") {
        this.verbose = false;

        this.ctx = ctx;
        this._x = x;
        this._y = y;
        this._width = width;
        this._height = height;
        this.color = color;
        this.img = img;

        this.children = {};
        this.parent = false;
        this.drawBorder = drawBorder;
        this.borderSize = borderSize;
        this.borderColor = borderColor;
        this._drawCenterText = drawCenterText;
        this.centerTextSizeMod = 1;
        this.centerText = centerText;

        globalBlockCollectionStack.addBlock(this);
    }

    /**
     * Remove this Block from the global Block collection of the current GameSlide
     */
    removeFromCollection() {
        delete globalBlockCollectionStack.globalBlockCollection()[this.key];
    }

    /**
     * Sets the display image of this Block (e.g. Enemy monster image)
     */
    set img(img) {
        this._img = img;
        this.image = new Image(this.widthGlobal, this.heightGlobal);
        this.image.src = img;
    }

    get img() {
        return this._img;
    }

    /**
     * Draw a @text in the middle of the Block-Object (e.g. 'Playfield' or 'Background') as
     * a display to see what this Block represents without an image (usefull for planning maps)
     * 
     * @param {string} text             Text to display
     * @param {number} size             Generic size modifier
     * @param {string} color            Text color
     * @param {boolean} fill            if set, text is filled
     * @param {number} fontWeight       font weight
     */
    drawCenterText(text = "Hello World", size = 10, color = "white", fill = true, fontWeight = 900) {
        let fontSize = this.centerTextSizeMod * size * this.heightGlobal / 100;
        this.ctx.font = `${fontWeight} ${fontSize}px Arial`;
        this.ctx.textAlign = "center";
        let x = this.xGlobal + this.widthGlobal / 2;
        let y = this.yGlobal + this.heightGlobal / 2 + fontSize / 3;
        if (fill) {
            this.ctx.fillStyle = color;
            this.ctx.fillText(text, x, y);
        } else {
            this.ctx.strokeStyle = color;
            this.ctx.strokeText(text, x, y + size / 2);
        }

    }

    /**
     * Calculates the Blocks size in relation to it's parent-block (e.g. width: 10%, height: 20%)
     * 
     * @param {*} name      width or height
     */
    fitParentSize(name) {
        return this.globalSize(name);
    }

    /**
     * Calculates the Blocks position in relation to it's parent-block (e.g. x: 10%, y: 20%)
     * 
     * @param {*} name      width or height
     */
    fitParentPosition(name) {
        return this.globalPosition(name);
    }

    /**
     * returns the global x or y value
     * 
     * @param {boolean} xy          true => width; false => height
     * @param {boolean} otherPos    (optional) if set, uses this position instead of block position
     */
    globalPosition(xy, otherPos) {
        let pos = otherPos ? otherPos : { x: this._x, y: this._y };
        if (this.parent) {
            let wOrH = xy == 'x' ? 'width' : 'height';
            wOrH += `Global`;
            let pInParent = this.parent[wOrH] * pos[`${xy}`] / 100;
            let shiftedByParent = pInParent + this.parent[`${xy}Global`];
            return shiftedByParent;
        }
        return otherPos ? otherPos[`${xy}`] : this[`_${xy}`];
    }

    globalX(otherPos) {
        return this.globalPosition('x', (otherPos != undefined) ? { x: otherPos, y: otherPos } : false);
    }

    globalY(otherPos) {
        return this.globalPosition('y', (otherPos != undefined) ? { x: otherPos, y: otherPos } : false);
    }

    /**
 * returns the global width or height
 * 
 * @param {boolean} wh   true => width; false => height
 * @param {boolean} otherSize    (optional) if set, uses this size instead of block size
 */
    globalSize(wh, otherSize) {
        let size = otherSize ? otherSize : { width: this._width, height: this._height };
        return this.parent ? this.parent[`${wh}Global`] * size[`${wh}`] / 100 : (otherSize ? otherSize[`${wh}`] : size[`${wh}`]);
    }

    globalWidth(otherSize) {
        return this.globalSize('width', (otherSize != undefined) ? { width: otherSize, height: otherSize } : false);
    }

    globalHeight(otherSize) {
        return this.globalSize('height', (otherSize != undefined) ? { width: otherSize, height: otherSize } : false);
    }


    get x() {
        return this._x;
    }

    get y() {
        return this._y;
    }

    get width() {
        return this._width;
    }

    get height() {
        return this._height;
    }

    get xGlobal() {
        return this.globalX();
    }

    get yGlobal() {
        return this.globalY();
    }

    get widthGlobal() {
        return this.globalWidth();
    }

    get heightGlobal() {
        return this.globalHeight();
    }

    set width(width) {
        this._width = width;
    }

    set height(height) {
        this._height = height;
    }

    /**
     * Centers the Block in the parent Block (e.g. center of a map)
     */
    centerInParent() {
        this._x = (100 - this._width) / 2;
        this._y = (100 - this._height) / 2;
    }


    /**
     * Draws the Block on the canvas and updates all its child elements (because draw is part of update)
     */
    draw() {
        if (this.color != "transparent") {
            this.ctx.fillStyle = this.color;
            this.ctx.fillRect(this.xGlobal, this.yGlobal, this.widthGlobal, this.heightGlobal);
        }
        if (this._drawCenterText) this.drawCenterText(this.centerText);

        if (this.drawBorder) {
            this.ctx.beginPath();
            this.ctx.lineWidth = this.borderSize;
            this.ctx.strokeStyle = this.borderColor;
            this.ctx.rect(this.xGlobal, this.yGlobal, this.widthGlobal, this.heightGlobal);
            this.ctx.stroke();
        }

        if (this.img) {
            this.ctx.drawImage(this.image, this.xGlobal, this.yGlobal, this.widthGlobal, this.heightGlobal);
        }
        Object.values(this.children).forEach(child => child.update());
    }

    reposition(x, y) {
        this._x = x;
        this._y = y;
    }

    /**
     * Updates the Blocks data and draws is
     */
    update() {
        this.draw();
    }

    /**
     * Appends a Block as a child object to the current Block
     * 
     * @param {Block} child 
     */
    appendChild(child) {
        // remove from old parent first
        if (child.parent) child.parent.removeChild(child);
        // then add to new parent
        this.children[child.key] = child;
        child.parent = this;
    }

    /**
     * Removes a child Block
     * 
     * @param {Block} child 
     */
    removeChild(child) {
        delete this.children[child.key];
        child.parent = false;
    }

    /**
     * Handles the removal of a Block and its children from the global data 
     */
    die() {
        this.removeFromCollection();
        if (this.parent) this.parent.removeChild(this);
        let keys = Object.keys(this.children);
        keys.forEach(key => this.children[key].die())
    }
}