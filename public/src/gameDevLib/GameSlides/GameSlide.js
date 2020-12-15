
import { Block } from '../Blocks/Block.js';
import * as BlockGlobal from '../Blocks/Block.js';
import * as UnitGlobal from '../Blocks/Units/Unit.js';

const appStack = [];
let buttonKeysGlobal;

/**
 * GameSlide
 * 
 * A game is devided in slides which can be seen as game states, e.g. Startmenu, Transition screens, Maps, etc..
 * You can either replace the currently running slide with a new one OR (most frequent use case) push the new one on the @appStack .
 * e.g. The main gameslide is running and the player clicks on pause
 *      => a new game slide 'PauseSlide' can be put on the top of the @appStack
 */
export class GameSlide {
    /**
     * 
     * @param {object} ctx Context of canvas
     * @param {number} width relative width on the "screen" (canvas)
     * @param {number} height see @width
     * @param {array} buttonNames names of the control buttons (e.g. up,down, A, B)
     * @param {array} buttonKeys the keyboard keys connected to the control buttons
     * @param {object} buttonActions map of functions that run on a button press
     */
    constructor(ctx, width, height, buttonNames, buttonKeys, buttonActions = {}) {
        GameSlide.preGameSlideCreation();
        this.ctx = ctx;
        this.buttonNames = buttonNames;
        this.buttonKeys = buttonKeys;
        buttonKeysGlobal = buttonKeys;
        this.buttonActions = buttonActions;
        this._state = "deactivated"; // running, paused, deactivated
        this.screen = new Block(this.ctx, 0, 0, width, height, "#100e17");
        this.framerate = 60;
        this.logicrate = 40;
        this.gameItv;
        this.buttons = {};
        this.buttonKeyToName = {};
        for (let i = 0; i < buttonKeys.length; i++) {
            this.buttonKeyToName[buttonKeys[i]] = buttonNames[i];
        }
        buttonNames.forEach(name => this.buttons[name] = false);

        this.logicFrames = 0;
    }

    /**
     * Creates new global Block collections for the new slide        
     */
    static preGameSlideCreation() {
        BlockGlobal.globalBlockCollectionStack.addBlockCollection();
        UnitGlobal.globalUnitCollectionStack.addBlockCollection();
    }

    /**
     * Initiates the controls for the slide and starts the loop for this game slide
     */
    static run() {
        if (appStack.length > 0) {
            let gameSlide = appStack[appStack.length - 1];

            let touchButtons = {};
            touchButtons['KeyW'] = document.getElementsByClassName('controlButtonUp')[0];
            touchButtons['KeyS'] = document.getElementsByClassName('controlButtonDown')[0];
            touchButtons['KeyA'] = document.getElementsByClassName('controlButtonLeft')[0];
            touchButtons['KeyD'] = document.getElementsByClassName('controlButtonRight')[0];
            touchButtons['KeyN'] = document.getElementsByClassName('controlButtonB')[0];
            touchButtons['KeyM'] = document.getElementsByClassName('controlButtonA')[0];
            touchButtons['Space'] = document.getElementsByClassName('controlButtonStart')[0];


            let mouseOrTouchStart = 'onmousedown';
            let mouseOrTouchEnd = 'onmouseup';
            if ('ontouchstart' in document.documentElement) {
                mouseOrTouchStart = 'ontouchstart';
                mouseOrTouchEnd = 'ontouchend';
            }

            // button controls
            function activateButton(keyCode) {
                if (!keyCode in buttonKeysGlobal) return;
                gameSlide.setKey(keyCode, true);
                touchButtons[keyCode].classList.add('touchActive');
            }

            function deactivateButton(keyCode) {
                if (!keyCode in buttonKeysGlobal) return;
                gameSlide.setKey(keyCode, false);
                touchButtons[keyCode].classList.remove('touchActive');
            }

            function setButtonFunctions(keyCode) {
                if (!keyCode in buttonKeysGlobal) return;
                touchButtons[keyCode][mouseOrTouchStart] = e => activateButton(keyCode);
                touchButtons[keyCode][mouseOrTouchEnd] = e => deactivateButton(keyCode);
            }

            setButtonFunctions('KeyW');
            setButtonFunctions('KeyS');
            setButtonFunctions('KeyA');
            setButtonFunctions('KeyD');
            setButtonFunctions('KeyN');
            setButtonFunctions('KeyM');
            setButtonFunctions('Space');

            // keyboard controls
            document.body.onkeydown = e => {
                activateButton(e.code);
            }

            document.body.onkeyup = e => {
                deactivateButton(e.code);
            }

            gameSlide.run();
        }
    }

    /**
     * Pauses the current slide
     */
    static pause() {
        if (appStack.length > 0) {
            appStack[appStack.length - 1].setAllKeys(false);
            appStack[appStack.length - 1].state = 'paused';
        }
    }

    /**
     * Pushes @gameSlide on top of @appStack
     * 
     * @param {GameSlide} gameSlide 
     */
    static push(gameSlide) {
        if (appStack.length > 0) GameSlide.pause();

        appStack.push(gameSlide);
        gameSlide.appIndex = appStack.length;
        GameSlide.run();
    }

    /**
     * Clears the @appStack
     */
    static clear() {
        while (appStack.length > 0) {
            GameSlide.pop(false);
        }
    }

    /**
     * Removes the top gameSlide and potentially starts the new one at the top
     * 
     * @param {boolean} run     If set, next game slide after pop will be started after the old one is removed
     */
    static pop(run = true) {
        if (appStack.length > 0) {
            GameSlide.pause();
            appStack.pop();
            BlockGlobal.globalBlockCollectionStack.removeBlockCollection();
            UnitGlobal.globalUnitCollectionStack.removeBlockCollection();

            if (run) return GameSlide.run();
        }
    }

    /**
     * Returns the current top game slide
     */
    static peak() {
        return appStack[appStack.length - 1];
    }

    /**
     * Length of the @appStack
     */
    static length() {
        return appStack.length;
    }

    /**
     * Returns how long the game has been running (good for timers as alternative to setTimeout/setInterval)
     */
    get runtime() {
        return this.logicFrames / this.logicrate;
    }

    /**
     * Maps @value to @key on @buttonKeyToName object
     * 
     * @param {string} key 
     * @param {object} value 
     */
    setKey(key, value) {
        if (this.buttonKeyToName[key]) this.buttons[this.buttonKeyToName[key]] = value;
    }

    /**
     * Maps all keys to @value
     * 
     * @param {object} value 
     */
    setAllKeys(value) {
        Object.keys(this.buttons).forEach(key => this.buttons[key] = value);
    }


    addBlock(block) {
        this.screen.appendChild(block);
    }

    end() {
        appStack.pop();
    }

    control() {
        Object.keys(this.buttons).forEach(button => {
            if (this.buttons[button]) {
                if (this.buttonActions[button]) this.buttonActions[button]();
            }
        });
    }

    /**
     * Loop for the current game slide
     */
    slideLoop() {

    }

    set state(state) {
        this._state = state;
        this.kill();
    }

    get state() {
        return this._state;
    }

    /**
     * Runs what should be done when a @GameSlide is ended
     */
    kill() {
        if (this._state != 'running' && this._state != 'paused') {
            this.onGameEnd();
        }
        if (this._state != 'running') {
            clearInterval(this.gameItv);
            clearInterval(this.gameLogicItv);
        }
    }

    onGameEnd() {

    }

    logicLoop() {
        this.control();
        this.kill();
    }

    /**
     * Intiates the logigLoop and gameLoop and runs them
     */
    run() {
        this.state = 'running';
        this.gameLogicItv = setInterval(() => {
            this.logicLoop();
            this.logicFrames++;
        }, 1000 / this.logicrate)

        this.gameItv = setInterval(() => {
            this.screen.update();
            this.slideLoop();
        }, 1000 / this.framerate)
    }
}