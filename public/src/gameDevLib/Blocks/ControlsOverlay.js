import { Block } from "./Block.js";


/**
 * ControlsOverlay
 * 
 * Overlay for the game screen to display additional information
 * (e.g. the controls)
 */
export class ControlsOverlay extends Block {
    constructor(ctx, x = 0, y = 0, width, height, ...controlItems) {
        super(ctx, x, y, width ? width : ctx.canvas.width, height ? height : ctx.canvas.height, 'red');
        this.controlItems = controlItems;
    }

    /**
     * see @Block
     */
    update() {
        let itemHeight = 100 / this.controlItems.length;
        for (let i = 0; i < this.controlItems.length; i++) {
            let item = this.controlItems[i];
            this.appendChild(item)
            item._x = 0;
            item._y = itemHeight * i;
            item._width = 100;
            item._height = itemHeight;
            item.centerTextSizeMod = 5;
        }
        super.update();
    }
}

/**
 * Item to show on a @ControlsOverlay. Pretty much just a new line on the overlay.
 */
export class ControlItem extends Block {
    constructor(ctx, name, value) {
        super(ctx);
        this.color = 'transparent';
        this.centerText = `${name} : ${value}`;
        this._drawCenterText = true;
    }


}