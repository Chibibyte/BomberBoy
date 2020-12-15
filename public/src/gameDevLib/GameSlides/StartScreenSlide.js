import { GameSlide } from './GameSlide.js';
import { Block } from '../Blocks/Block.js';
import { ControlsOverlay, ControlItem } from '../Blocks/ControlsOverlay.js';
import { InGameSlide } from './InGameSlide.js';
import { Level } from '../../Levels/Level.js';

/**
 * StartScreenSlide
 * 
 * GameSlide for the game start
 */
export class StartScreenSlide extends GameSlide {
    constructor(ctx, width, height, buttonNames, buttonKeys, buttonActions = {}) {
        super(ctx, width, height, buttonNames, buttonKeys, buttonActions);
        this.background = new Block(ctx, 0, 0, 100, 100);
        this.screen.appendChild(this.background);

        this.background._drawCenterText = true;
        this.background.centerText = "Press Start";

        let controlItems = [];
        for (let i = 0; i < buttonNames.length; i++) {
            let buttonKey = buttonKeys[i].includes('Key') ? buttonKeys[i].slice(3, buttonKeys[i].length) : buttonKeys[i];
            controlItems.push(new ControlItem(ctx, buttonNames[i], buttonKey.toUpperCase()));
        }
        this.controlsView = new ControlsOverlay(ctx, 60, 50, 50, 50, ...controlItems);
        this.controlsView.color = 'transparent';

        this.background.appendChild(this.controlsView);

        this.buttonActions['START'] = () => {
            GameSlide.push(new InGameSlide(ctx, width, height, buttonNames, buttonKeys));
        }


    }

    update() {
        this.background.update();
    }

    slideLoop() {
        this.screen.update();
        this.control();
    }
}