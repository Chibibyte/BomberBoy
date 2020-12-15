import { BackgroundMap } from '../gameDevLib/Blocks/BackgroundMaps/BackgroundMap.js';
import { Block } from '../gameDevLib/Blocks/Block.js';
import { Container } from '../gameDevLib/Blocks/Container.js';
import { InfoBoard, InfoItem } from '../InfoBoard.js';
import { BlockGrid } from '../gameDevLib/Blocks/BlockGrid.js';
import * as BlockGlobal from '../gameDevLib/Blocks/Block.js';
import * as UnitGlobal from '../gameDevLib/Blocks/Units/Unit.js';
import { Unit } from '../gameDevLib/Blocks/Units/Unit.js';
import { Player } from '../gameDevLib/Blocks/Units/Player.js';
import { Enemy } from '../gameDevLib/Blocks/Units/Enemy.js';
import { Destructible } from '../gameDevLib/Blocks/Units/Destructible.js';
import { Item } from '../gameDevLib/Blocks/Units/Item.js';
import { Indestructible } from '../gameDevLib/Blocks/Units/Indestructible.js';
import { Bomb } from '../gameDevLib/Blocks/Units/Bomb.js';
import { Explosion } from '../gameDevLib/Blocks/Units/Explosion.js';

const TOP_SIZE = 10;
const INNER_BG_WIDTH = 90;
const INNER_BG_HEIGHT = 100;
const PLAYFIELD_WIDTH = 87;
const PLAYFIELD_HEIGHT = 90;
const INFOITEM_WIDTH = 40;
const INFOITEM_HEIGHT = 100;
const DEF_LIFES = 5;
const DEF_TIME = 300;
const ITEM_SPAWN_CHANGE = 0.5;

/**
 * Level
 * 
 * Actual level in BomberGuy
 */
export class Level extends BackgroundMap {
    constructor(ctx, x, y, width, height, outerBgSrc = "res/brickWall.jpg", innerBgSrc = "res/prisonBG.png", obstacleImg = "res/obstacleBrick.png", destructibleImg = "res/zbush.png",
        destructiblePositions, enemyPositions, lifes = 5, time = 200, levelId = 0) {
        super(ctx, x, y, width, height);
        this.verbose = false;

        this.color = "red";

        this.bombs = {};
        this.explosions = {};
        this.gameState = 'running';
        this.enemies = {};

        this.top = new InfoBoard(ctx, 0, 0, 100, TOP_SIZE, "black", "white", "h", "30");
        this.addInfoBoardItem("0", "score", "");
        this.addInfoBoardItem(DEF_TIME, "time", "T: ");
        this.addInfoBoardItem(DEF_LIFES, "lifes", "LEFT: ");
        this.addInfoBoardItem(levelId, "level", "LEVEL: ");

        this.main = new Block(ctx, 0, TOP_SIZE, 100, 100 - TOP_SIZE, "green");

        this.appendChild(this.top);
        this.appendChild(this.main);

        this.outerBackground = new Block(ctx, 0, 0, 100, 100, "red", outerBgSrc);
        this.innerBackground = new Block(ctx, (100 - INNER_BG_WIDTH) / 2, (100 - INNER_BG_HEIGHT) / 2, INNER_BG_WIDTH, INNER_BG_HEIGHT, "red", innerBgSrc);

        this.playfield = new BlockGrid(ctx, 13, 11, "#886f00");
        this.playfield._x = (100 - PLAYFIELD_WIDTH) / 2;
        this.playfield._y = (100 - PLAYFIELD_HEIGHT + 6) / 2;
        this.playfield.width = PLAYFIELD_WIDTH;
        this.playfield.height = PLAYFIELD_HEIGHT;

        for (let i = 1; i < this.playfield.maxRows; i += 2) {
            this.playfield.fillRow(i, true, false, false, Indestructible);
        }

        this.playfield.blockApply(block => block.img = obstacleImg);



        if (enemyPositions) {
            enemyPositions.forEach(pos => {
                let enemy = new Enemy(ctx);
                this.enemies[enemy.key] = enemy;
                this.playfield.setBlock(pos.x, pos.y, enemy, true, true);
            })
        } else {
            let enemiesArr = [];
            enemiesArr.push(new Enemy(ctx));
            enemiesArr.push(new Enemy(ctx));
            enemiesArr.push(new Enemy(ctx));
            this.enemies[enemiesArr[enemiesArr.length - 3].key] = enemiesArr[enemiesArr.length - 3];
            this.enemies[enemiesArr[enemiesArr.length - 2].key] = enemiesArr[enemiesArr.length - 2];
            this.enemies[enemiesArr[enemiesArr.length - 1].key] = enemiesArr[enemiesArr.length - 1];
            this.playfield.setBlock(6, 5, enemiesArr[enemiesArr.length - 3], true, true);
            this.playfield.setBlock(5, 10, enemiesArr[enemiesArr.length - 2], true, true);
            this.playfield.setBlock(9, 10, enemiesArr[enemiesArr.length - 1], true, true);
        }

        let setDestructible = (x, y) => {
            console.log("pos.x, pos.y", x, y)
            let index = this.playfield.coordsToIndex(x, y);
            this.playfield.setBlockByIndex(index, new Destructible(ctx, destructibleImg), true, false)
        }

        if (destructiblePositions) {
            destructiblePositions.forEach(pos => setDestructible(pos.x, pos.y));
        } else {
            setDestructible(3, 0);
            setDestructible(5, 0);
            setDestructible(10, 0);

            setDestructible(4, 1);

            setDestructible(1, 2);
            setDestructible(7, 2);
            setDestructible(11, 2);

            setDestructible(4, 3);

            setDestructible(7, 4);
            setDestructible(12, 4);

            setDestructible(0, 5);
            setDestructible(2, 5);

            setDestructible(0, 6);
            setDestructible(3, 6);
            setDestructible(7, 6);
            setDestructible(3, 6);

            setDestructible(2, 7);
            setDestructible(4, 7);
            setDestructible(6, 7);
            setDestructible(12, 7);

            setDestructible(2, 8);
            setDestructible(5, 8);
            setDestructible(9, 8);
            setDestructible(10, 8);
            setDestructible(11, 8);
            setDestructible(12, 8);

            setDestructible(1, 9);

            setDestructible(7, 10);
        }

        this.lifes = lifes;
        this.time = time;
        this.level = levelId;

        this.player = new Player(this.ctx);
        this.playfield.setBlock(0, 0, this.player, true, true);

        this.main.appendChild(this.outerBackground);
        this.outerBackground.appendChild(this.innerBackground);
        this.innerBackground.appendChild(this.playfield);

        this.doDrawCenterText(false);

        this.centerText = "Map";
        this.top.centerText = "Top";
        this.main.centerText = "Main";
        this.outerBackground.centerText = "Background";
        this.playfield.centerText = "Playfield";



        // top: score, time, lives
        this.bombGridCoords;
    }

    /**
     * Destroys a destructible on hit and spawns an item in it's place at random
     * 
     * @param {Block} block Block to be hit by an explosion
     * @param {number} index Grid index of block
     */
    blockHit(block, index) {
        if (block.unitType == "destructible") {
            this.playfield.setBlockByIndex(index, false, true, false);
            this.playfield.setBlockByIndex(index, this.spawnItem(), true, true);
        }
    }

    /**
     * Spawns an item at random with a @ITEM_SPAWN_CHANGE probability
     */
    spawnItem() {
        let rand = Math.random();
        if (rand <= ITEM_SPAWN_CHANGE) return new Item(this.ctx);
        return false;
    }

    /**
     * Updates everything within the level
     */
    update() {
        UnitGlobal.globalUnitCollectionStack.blockArray().forEach(child => {
            if (child.lifeState == "dead") {
                this.playfield.removeChild(child);
                child.die();
            }

        })
        if (this.player.lifeState == 'dead') { this.gameState = 'deactivated'; return; }
        else if (Object.keys(this.enemies).length == 0) { this.gameState = 'win'; return; }

        Object.values(this.enemies).forEach(enemy => {
            if (enemy.lifeState == 'dead') {
                this.score = Number(this.score) + enemy.points;
                delete this.enemies[enemy.key];
                enemy.removeFromCollection();
                if (enemy.parent) enemy.parent.removeChild(enemy);
            }
        })

        Object.values(this.bombs).forEach(bomb => {
            if (this.player.remoteDetonation && bomb.remoteBomb) {
                clearTimeout(bomb.bombTimeout);
                bomb.exploded = true;
            }
            if (bomb.exploded) {
                delete this.bombs[bomb.key];
                this.bombGridCoords = this.playfield.unitToGridCoords(bomb._x, bomb._y);
                let explosion1 = new Explosion(this.ctx, bomb.explosionSize, 'x');
                let explosion2 = new Explosion(this.ctx, bomb.explosionSize, 'y');
                this.explosions[explosion1.key] = explosion1;
                this.explosions[explosion2.key] = explosion2;
                this.playfield.setBlock(this.bombGridCoords.x, this.bombGridCoords.y, false, true, false);
                this.playfield.setBlock(this.bombGridCoords.x, this.bombGridCoords.y, explosion1, false, true);
                this.playfield.setBlock(this.bombGridCoords.x, this.bombGridCoords.y, explosion2, false, true);

                // calc explosion boundaries
                // 1) get explosion center in BlockGrid
                let explosionCenter = this.bombGridCoords;
                // 2) get explosion size for each side
                let explosionSizePerDirection = explosion1.explosionSize;
                // 3) check if path is free
                let playfield = this.playfield;
                function checkDir(axis, dir, context) {
                    let maxAxisV = axis == 'x' ? playfield.maxColumns : playfield.maxRows;
                    let shift = 0;
                    let axisV = 0;
                    while (shift < explosionSizePerDirection) {
                        shift++;
                        axisV = explosionCenter[axis] + dir * shift;

                        let nextX = axis == 'x' ? axisV : explosionCenter.x;
                        let nextY = axis == 'y' ? axisV : explosionCenter.y;
                        let index = playfield.coordsToIndex(
                            nextX,
                            nextY);
                        if (axisV < 0 || axisV >= maxAxisV || !playfield.isEmpty(index)) {
                            let block = playfield.getBlock(index);
                            if (block && block.unitType == 'bomb') continue;
                            if (block) context.blockHit(block, index);
                            shift--;
                            axisV = explosionCenter[axis] + dir * shift;
                            break;
                        }
                    }
                    return axisV;
                }
                // horizontal
                let left = checkDir('x', -1, this);
                let right = checkDir('x', 1, this);
                // vertical
                let up = checkDir('y', -1, this);
                let down = checkDir('y', 1, this);


                explosion1.storeOrigData();
                explosion2.storeOrigData();
                let l = this.playfield.gridToUnitCoords(left, 0).x;
                let u = this.playfield.gridToUnitCoords(0, up).y;
                explosion1.grow(l, right - left);
                explosion2.grow(u, down - up);
                this.player.bombs++;
            }
        })
        Object.values(this.explosions).forEach(explosion => {
            if (explosion.fireout) {
                delete this.explosions[explosion.key];
                explosion.removeFromCollection();
                explosion.parent.removeChild(explosion);
            }
        })
        if (this.player.bombplaced) {
            let playerGridCoords = this.playfield.unitToGridCoords(this.player._x, this.player._y);
            if (this.playfield.isEmpty(this.playfield.coordsToIndex(playerGridCoords.x, playerGridCoords.y))) {
                let bomb = new Bomb(this.ctx, this.player.bombTimer, this.player.bombSize, this.player.remoteBombs);
                this.playfield.setBlock(playerGridCoords.x, playerGridCoords.y, bomb, false, false);
                this.player.bombs--;
                this.bombs[bomb.key] = bomb;
            }
            this.player.bombplaced = false;
        }

        super.update();
    }

    /**
     * Creates and adds an InfoItem for the InfoBord at the top of each level
     * 
     * @param {string} initValue Initial value of board item
     * @param {string} name 
     * @param {string} prefix 
     * @param {string} suffix 
     */
    addInfoBoardItem(initValue = 0, name = "", prefix, suffix = "") {
        this.top.addItem(new InfoItem(this.ctx, INFOITEM_WIDTH, INFOITEM_HEIGHT, initValue, prefix != undefined ? prefix : name.toUpperCase(), suffix), name);
    }

    set score(score) {
        this.top.infoItems["score"].value = score;
    }

    set time(time) {
        this.top.infoItems["time"].value = time;
    }

    set lifes(lifes) {
        this.top.infoItems["lifes"].value = lifes;
    }

    set level(level) {
        this.top.infoItems["level"].value = level;
    }

    set gameState(gameState) {
        this._gameState = gameState;
    }

    get gameState() {
        return this._gameState;
    }

    get score() {
        return this.top.infoItems["score"].value;
    }

    get time() {
        return this.top.infoItems["time"].value;
    }

    get lifes() {
        return this.top.infoItems["lifes"].value;
    }

    get level() {
        return this.top.infoItems["level"].value;
    }


    /**
     * Sets drawCenterText for the parts that build up the level
     * 
     * @param {*} draw 
     */
    doDrawCenterText(draw) {
        this._drawCenterText = draw;
        this.top._drawCenterText = draw;
        this.main._drawCenterText = draw;
        this.outerBackground._drawCenterText = draw;
        this.playfield._drawCenterText = draw;
    }
}