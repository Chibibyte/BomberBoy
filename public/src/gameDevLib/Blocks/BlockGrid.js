import * as BlockGlobal from "./Block.js";
import * as UnitGlobal from "./Units/Unit.js";
import { Block } from "./Block.js";

/**
 * Grid of Blocks
 * 
 * Devides its space into a grid and allows for grid placement of blocks (instead of exact positions)
 */
export class BlockGrid extends Block {
    constructor(ctx, maxColumns, maxRows, color, adjustSize = true) {
        super(ctx);
        this.color = color;
        this.maxColumns = maxColumns;
        this.maxRows = maxRows;
        this.adjustSize = adjustSize;
        this.blocks = new Array(maxColumns * maxRows);
        this.blocks.fill(false);
        this.xStep = 100 / this.maxColumns;
        this.yStep = 100 / this.maxRows;
        this.index = 0;
    }

    /**
     * Transforms index to grid coords
     * 
     * @param {*} index 
     */
    indexToCoords(index) {
        let coords = {};
        coords.x = index % this.maxColumns;
        coords.y = (index - coords.x) / this.maxColumns;
        return coords;
    }

    /**
     * Transforms grid coords to index
     */
    coordsToIndex(gridX, gridY) {
        let index = gridY * this.maxColumns + gridX;
        return index;
    }


    /**
     * Transforms unit to grid coordinates
     * 
     * @param {*} unitX 
     * @param {*} unitY 
     */
    unitToGridCoords(unitX, unitY) {
        let gridX = Math.round(unitX / this.xStep);
        let gridY = Math.round(unitY / this.yStep);
        return { x: gridX, y: gridY };
    }

    /**
     * Transforms unit coords to index
     */
    unitCoordsToIndex(gridX, gridY) {
        let gridCoords = this.unitToGridCoords(gridX, gridY);
        return this.coordsToIndex(gridCoords.x, gridCoords.y);
    }

    /**
     * Transforms grid to unit coordinates
     * 
     * @param {*} unitX 
     * @param {*} unitY 
     */
    gridToUnitCoords(gridX, gridY) {
        let x = this.xStep * gridX;
        let y = this.yStep * gridY;
        return { x, y };
    }

    /**
     * Checks if the grid position on @index is empty
     * 
     * @param {*} index 
     */
    isEmpty(index) {
        return (!this.blocks[index] || this.blocks[index] == undefined);
    }

    /**
     * Returns the Block stored in @index
     * 
     * @param {*} index 
     */
    getBlock(index) {
        return this.blocks[index];
    }

    /**
     * Places a block (or false) at the grid location @index
     * 
     * @param {*} index         
     * @param {*} block         
     * @param {*} overwrite     Whether or not to overwrite an existing block if position taken
     * @param {*} spawnOnly     If set, block will only be placed at that grid position (for exact placement in grid without tracking)
     */
    setBlockByIndex(index, block, overwrite = true, spawnOnly = false) {
        // delete existing block globally and locally
        if (this.blocks[index]) {
            if (!overwrite || spawnOnly) return false;
            let oldBlock = this.blocks[index];
            oldBlock.removeFromCollection();
            delete this.children[oldBlock.key];
        }
        // set new block and change position
        if (!spawnOnly) this.blocks[index] = block;
        if (!block) return true;
        this.appendChild(block);
        let coords = this.indexToCoords(index);
        block._x = this.xStep * coords.x;
        block._y = this.yStep * coords.y;
        if (this.adjustSize) {
            block.width = this.xStep;
            block.height = this.yStep;
        }
        return true;
    }

    /**
     * 
     * @param {number} x grid x
     * @param {number} y grid y
     * @param {Block} block Block to place on (x,y)
     * @param {boolean} overwrite if set, old Block in this position will be overwritten
     * @param {boolean} spawnOnly if set, @block will be placed in position (x,y) BUT not stored in grid
     *                              therefore on 
     */
    setBlock(x, y, block, overwrite = true, spawnOnly = false) {
        let index = y * this.maxColumns + x;
        return this.setBlockByIndex(index, block, overwrite, spawnOnly);
    }


    addBlock(block) {
        this.setBlockByIndex(this.index, block);
        this.index++;
    }

    /**
     * Fills a row with blocks of type given in @data OR false (alternating)
     * @param  {number} row     row index
     * @param  {...any} data    A date can be a blocks class or false (e.g.: BlockA, BlockB, false, BlockC)
     */
    fillRow(rowIndex, overwrite = true, spawnOnly = false, ...data) {
        let start = this.maxColumns * rowIndex;
        let end = start + this.maxColumns;
        let dataIndex = 0;
        while (start < end) {
            let date = data[dataIndex];
            dataIndex = (dataIndex + 1) % data.length;
            let newBlock = !date ? false : new date(this.ctx);
            let success = this.setBlockByIndex(start, newBlock, overwrite, spawnOnly)
            if (!success) {
                newBlock.removeFromCollection();
            }
            start++;
        }
    }

    /**
     * Applies function @fct on every block element stored in this @BlockGrid
     * 
     * @param {function} fct function to apply 
     */
    blockApply(fct) {
        this.blocks.forEach(block => block ? fct(block) : false);
    }
}