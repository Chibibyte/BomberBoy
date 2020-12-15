import { Block } from '../Block.js';

/**
 * Basic background map for units to walk on
 */
export class BackgroundMap extends Block {
    constructor(ctx, x = 0, y = 0, width, height) {
        super(ctx, x, y, width ? width : ctx.canvas.width, height ? height : ctx.canvas.height, 'green');
    }
}