import { Block } from "./Block.js";

/**
 * Container for blocks
 * 
 * Items will be:
 * aligned: horizontal (later vertical)
 * centered
 * positioned: by padding and alignment (equally distributed over existing space)
 */

export class Container extends Block {
    constructor(ctx, x = 0, y = 0, width = 100, height = 100, color = "transparent", paddingX = 10, paddingY = 10) {
        super(ctx, x, y, width, height, color);
        this._paddingX = paddingX;
        this._paddingY = paddingY;

        this.subContainer = new Block(ctx, 0, 0, 100 - paddingX, 100 - paddingY, this.color);
        this.appendChild(this.subContainer);
        this.update();
    }

    /**
     * see @Block
     */
    update() {
        this.centerItems();
        this.alignItems();
        super.update();
    }

    
    set paddingX(paddingX) {
        this._paddingX = paddingX;
        this.centerItems();
    }

    set paddingY(paddingY) {
        this._paddingY = paddingY;
        this.centerItems();
    }

    centerItems() {
        this.subContainer.centerInParent();
    }

    removeChild(child) {
        this.subContainer.removeChild(child);
    }

    appendContainerChild(block) {
        this.subContainer.appendChild(block);
    }

    alignItems() {
        let children = Object.values(this.subContainer.children);
        if (children.length > 1) {
            let pos = children[0].width;
            children[0]._x = 0;
            let restWidthSum = 0;
            children.forEach(child => restWidthSum += child.width);
            let shift = (100 - restWidthSum) / (children.length - 1);

            for (let i = 1; i < children.length; i++) {
                pos += shift;
                children[i]._x = pos;
                pos += children[i].width;
            }
        } else if (children.length == 1) {
            let child = children[0];
            let restWidth = 100 - child.width;
            child._x = restWidth / 2;
        }
    }
}