import { GameSlide } from './GameSlide.js';
import { Block } from '../Blocks/Block.js';
import { Level } from '../../Levels/Level.js';
import { InGameSlide } from './InGameSlide.js';

/**
 * LoseSlide
 * 
 * GameSlide if the player loses
 */
export class LoseSlide extends GameSlide {
    constructor(ctx, width, height, buttonNames, buttonKeys, buttonActions = {}) {
        super(ctx, width, height, buttonNames, buttonKeys, buttonActions);
        this.background = new Block(ctx, 0, 0, 100, 100);
        this.screen.appendChild(this.background);

        this.background._drawCenterText = true;
        this.background.centerText = "YOU LOSE";


    }

    update() {
        this.background.update();
    }
}