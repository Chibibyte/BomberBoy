
import * as util from "./util.js";

/**
 * Array of Block collections
 * 
 * A Block collection is a key => value Object with Block-Values
 * 
 * Saved as a stack for GameSlides which can also be switched in a stack
 * Switching a GameSlide should switch the BlockCollection
 */
export class BlockCollectionStack {
    constructor() {
        this.stack = [];
    }

    /**
     * Pushes new Block collection on the stack 
     */
    addBlockCollection() {
        this.stack.push({});
    }

    getBlock(key) {
        return this.globalBlockCollection()[key];
    }

    deleteBlock(key) {
        delete this.globalBlockCollection()[key];
    }

    keyArray() {
        return Object.keys(this.globalBlockCollection());
    }

    blockArray() {
        return Object.values(this.globalBlockCollection());
    }

    /**
     * Removes the current collection from the stack 
     */
    removeBlockCollection() {
        if (this.stack.length > 0) {
            this.blockArray().forEach(block => {
                block.die();
            });
            this.stack.pop();
        }
    }

    globalBlockCollection() {
        return this.stack[this.stack.length - 1];
    }

    get length() {
        return (this.stack.length > 0) ? Object.keys(this.globalBlockCollection()).length : -1;
    }

    /**
     * Adds a block to the current Block collection
     * 
     * @param {Block} block 
     */
    addBlock(block, oldKey = true) {
        if (!oldKey || !block.key) {
            let key = util.generateHexKey();
            while (this.globalBlockCollection()[key]) key = util.generateHexKey();
            block.key = key;
        }
        this.globalBlockCollection()[block.key] = block;
    }
}