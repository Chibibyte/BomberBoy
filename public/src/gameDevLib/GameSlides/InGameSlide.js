import { GameSlide } from './GameSlide.js';
import * as UnitGlobal from '../Blocks/Units/Unit.js';
import * as BlockGlobal from '../Blocks/Block.js';
import { StartScreenSlide } from './StartScreenSlide.js';
import { WonSlide } from './WonSlide.js';
import { PauseScreenSlide } from './PauseScreenSlide.js';
import { Level } from '../../Levels/Level.js';
import { LoseSlide } from './LoseSlide.js';

/*
constructor(ctx, x, y, width, height, outerBgSrc = "res/brickWall.jpg", innerBgSrc = "res/prisonBG.png", obstacleImg = "res/obstacleBrick.png",
        destructiblePositions, enemyPositions, lifes = 5, time = 200)
*/

function createLevel(outerBgSrc = "res/brickWall.jpg", innerBgSrc = "res/prisonBG.png", obstacleImg = "res/obstacleBrick.png", destructibleImg = "res/zbush.png",
    destructiblePositions = undefined, enemyPositions = undefined, lifes = 5, time = 200) {
    return {
        outerBgSrc, innerBgSrc, obstacleImg, destructibleImg,
        destructiblePositions, enemyPositions, lifes, time
    }
}

let defaultLevel = createLevel();

function createPositionArray(xy) {
    let arr = [];
    for (let i = 0; i < xy.length; i += 2) {
        arr.push({ x: xy[i], y: xy[i + 1] })
    }
    return arr;
}

let levels = [defaultLevel];

function createAndPushLevel(destructiblePositions = [], enemyPositions = [{ x: 12, y: 8 }],
    lifes = 5, time = 200,
    outerBgSrc = "res/brickWall.jpg", innerBgSrc = "res/prisonBG.png", obstacleImg = "res/obstacleBrick.png", destructibleImg = "res/zbush.png") {
    levels.push(createLevel(outerBgSrc, innerBgSrc, obstacleImg, destructibleImg,
        destructiblePositions, enemyPositions, lifes, time))
}

function createAndPushDefault(destrPArr, enemPArr) {
    createAndPushLevel(
        createPositionArray(destrPArr), createPositionArray(enemPArr), 112, 333,
        undefined, undefined, undefined, undefined);
}

function mirrorPositions(arr, xMax, yMax, mirrorX, mirrorY) {
    let out = [...arr];
    function mirrorPos(p, pMax) {
        return pMax - p;
    }
    if (mirrorX) {
        for (let i = 0; i < arr.length; i += 2) out[i] = mirrorPos(arr[i], xMax);
    }
    if (mirrorY) {
        for (let i = 1; i < arr.length; i += 2) out[i] = mirrorPos(arr[i], yMax);
    }
    return out;
}

// destructible and enemy positions
let destrsPsArr = [[3, 5, 2, 9, 4, 1, 10, 2, 4, 5, 3, 8, 4, 2, 9, 2, 11, 6, 12, 7, 9, 9, 8, 9, 7, 6, 8, 6, 8, 5, 6, 3, 0, 3, 7, 0, 0, 10, 0, 9, 1, 10, 3, 4, 1, 6, 5, 10]];
let enemPsArr = [[2, 5, 2, 8, 4, 3, 9, 2, 10, 8]];

destrsPsArr.push(mirrorPositions(destrsPsArr[0], 12, 10, true, true));
enemPsArr.push(mirrorPositions(enemPsArr[0], 12, 10, true, true));

destrsPsArr.push(mirrorPositions(destrsPsArr[0], 12, 10, true, false));
enemPsArr.push(mirrorPositions(enemPsArr[0], 12, 10, true, false));

createAndPushDefault(destrsPsArr[0], enemPsArr[0]);
createAndPushDefault(destrsPsArr[1], enemPsArr[1]);
createAndPushDefault(destrsPsArr[2], enemPsArr[2]);

console.log("destrsPsArr", destrsPsArr);


function getLevel(index, ctx) {
    if (levels.length == 0) return defaultLevel();
    let { outerBgSrc, innerBgSrc, obstacleImg, destructibleImg, destructiblePositions, enemyPositions, lifes, time } = levels[index];
    return new Level(ctx, 0, 0, 100, 100, outerBgSrc, innerBgSrc, obstacleImg, destructibleImg,
        destructiblePositions, enemyPositions, lifes, time, index + 1);
}

let levelIndex = 0;
/**
 * InGameSlide
 * 
 * Actual GameSlide for BomberGuy
 */
export class InGameSlide extends GameSlide {
    /**
     * see @GameSlide
     * 
     */
    constructor(ctx, width, height, buttonNames, buttonKeys, buttonActions = {}) {
        super(ctx, width, height, buttonNames, buttonKeys, buttonActions);
        if (levelIndex >= levels.length) levelIndex = 0;
        this.map = getLevel(levelIndex, ctx);
        this.screen.appendChild(this.map);
        if (levelIndex >= levels.length) levelIndex = 0;
        this.units = UnitGlobal.globalUnitCollectionStack.globalBlockCollection();

        this.startTime = this.map.time;

        this.gameEndState = 'none'; //none, timer, death, win

        this.buttonActions['START'] = () => {
            GameSlide.push(new PauseScreenSlide(ctx, width, height, buttonNames, buttonKeys));
        }
    }

    /**
     * @see GameSlide
     * 
     */
    setKey(key, value) {
        super.setKey(key, value);
    }

    /**
     * Set/unset if hitboxes of all units should be displayed
     * 
     * @param {boolean} show 
     */
    showHitboxes(show) {
        Object.values(this.units).forEach(unit => unit.drawBorder = show);
    }

    /**
     * see @GameSlide
     */
    onGameEnd() {
        switch (this.gameEndState) {
            case 'win':
                levelIndex++;
                let wonSlide = new WonSlide(this.ctx, this.screen._width, this.screen._height, this.buttonNames, this.buttonKeys);
                wonSlide.background.centerText = "LEVEL " + (levelIndex + 1);
                wonSlide.buttonActions['START'] = () => {
                    GameSlide.clear();
                    GameSlide.push(new InGameSlide(this.ctx, this.screen._width, this.screen._height, this.buttonNames, this.buttonKeys));
                }
                GameSlide.push(wonSlide);
                break;
            case 'timer':
                GameSlide.pop();
                break;
            case 'death':
                let loseSlide = new LoseSlide(this.ctx, this.screen._width, this.screen._height, this.buttonNames, this.buttonKeys);
                loseSlide.buttonActions['START'] = () => {
                    GameSlide.clear();
                    GameSlide.push(new StartScreenSlide(this.ctx, this.screen._width, this.screen._height, this.buttonNames, this.buttonKeys));
                }
                GameSlide.push(loseSlide);
                break;
            default:
                return;
        }
    }

    /**
     * see @GameSlide
     */
    slideLoop() {
        this.map.time = this.startTime - Math.round(this.runtime);
        this.map.player.buttons = this.buttons;
        let playerState = this.map.player.playerState;
        if (this.map.time == 0 || this.map.gameState != 'running' || playerState == 'dead') {
            this._state = 'deactivated';
            if (this.map.gameState == 'win') {
                this.gameEndState = 'win';
            }
            else this.gameEndState = 'death';
        }
        UnitGlobal.resetCollisionCheckCount();
    }
}