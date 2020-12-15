import { Unit } from "./Unit.js";
import { GameSlide } from "../../GameSlides/GameSlide.js";
import { StartScreenSlide } from "../../GameSlides/StartScreenSlide.js";

const maxBombs = 8;

/**
 * Player 
 * 
 * Player class for BomberBoy
 * A player
 */
export class Player extends Unit {
    constructor(ctx) {
        super(ctx);
        this.controlActive = true;
        this.buttonActions = {
            'LEFT': () => this.direction.x = -1,
            'RIGHT': () => this.direction.x = 1,
            'UP': () => this.direction.y = -1,
            'DOWN': () => this.direction.y = 1,
            'A': () => {
                if (!this.bombplaced && this.bombs > 0) {
                    this.bombplaced = true;
                }
            },
            'B': () => {
                if (this.remoteBombs) {
                    this.remoteDetonation = true;
                }
            },
            'not_B': () => {
                this.remoteDetonation = false;
            }
        };
        this.img = "res/mainchar1.png";
        this.speed = 0.4;
        this.unitType = "player";
        this.bombplaced = false;
        this.remoteDetonation = false;
        this.bombs = 1;
        this.bombSize = 1;
        this.bombTimer = 2;
        this.remoteBombs = false;

        this.collisionIgnoreTypes = [];

        this.collisionReactions = [
            this.defaultCollisionReaction.bind(this),
            this.itemCollisionReaction.bind(this),
            this.bombCollisionReaction.bind(this),
            this.explosionCollisionReaction.bind(this),
            this.enemyCollisionReaction.bind(this)
        ];
    }

    itemCollisionReaction(collisionUnit) {
        // types: 'moreBombs', 'biggerBombs', 'remoteBombs';
        if (collisionUnit.unitType == "item") {
            let item = collisionUnit;
            switch (item.itemType) {
                case 'moreBombs':
                    if (this.bombs < maxBombs) this.bombs++;
                    break;
                case 'biggerBombs':
                    this.bombSize++;
                    break;
                case 'remoteBombs':
                    this.remoteBombs = true;
                    break;
            }
            return true;
        }
        return true;
    }



    explosionCollisionReaction(collisionUnit) {
        if (collisionUnit.unitType == "explosion") {
            this.lifeState = 'dead';
            return false;
        }
        return true;
    }

    enemyCollisionReaction(collisionUnit) {
        if (collisionUnit.unitType == "enemy") {
            this.lifeState = 'dead';
            return false;
        }
        return true;
    }

    move() {
        super.move();
        this.direction = { x: 0, y: 0 };
    }
}