import { GameSlide } from './GameSlide.js';
import { Block } from '../Blocks/Block.js';

/**
 * PauseScreenSlide
 * 
 * GameSlide if the player pauses the game
 */
export class PauseScreenSlide extends GameSlide {
    constructor(ctx, width, height, buttonNames, buttonKeys, buttonActions = {}) {
        super(ctx, width, height, buttonNames, buttonKeys, buttonActions);
        this.background = new Block(ctx, 0, 0, 100, 100);
        this.screen.appendChild(this.background);

        this.background._drawCenterText = true;
        this.background.centerText = "Pause";

        this.buttonActions['START'] = () => {
            GameSlide.pop();
        }
    }

    update() {
        this.background.update();
    }
}