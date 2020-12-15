import { RoamingUnit } from "./RoamingUnit.js";

const types = ['moreBombs', 'biggerBombs', 'remoteBombs'];
const chances = [2, 3, 1];

/**
 * Item 
 * 
 * Object that can be collected by the player provide advantages (or disadvantages)
 * (e.g. more bombs, bigger explosions, remote bombs)
 */
export class Item extends RoamingUnit {
    constructor(ctx) {
        super(ctx);
        this.img = "res/item.png";
        this.speed = 0.0;
        this.unitType = "item";

        this.collisionReactions = [
            this.defaultCollisionReaction.bind(this),
            this.explosionCollisionReaction.bind(this),
            this.playerCollisionReaction.bind(this)
        ];

        this.setItemType();
    }

    /**
     * Reaction to contact with explosion
     * 
     * @param {*} collisionUnit 
     */
    explosionCollisionReaction(collisionUnit) {
        if (collisionUnit.unitType == "explosion") {
            this.lifeState = 'dead';
            return false;
        }
        return true;
    }

    /**
 * Reaction to contact with player
 * 
 * @param {*} collisionUnit 
 */
    playerCollisionReaction(collisionUnit) {
        if (collisionUnit.unitType == "player") {
            this.lifeState = 'dead';
            return false;
        }
        return true;
    }

    /**
     * Randomly choses one item type from @types for this Item
     * with the spawn chances stored in @chances
     */
    setItemType() {
        let pool = [];
        for (let i = 0; i < chances.length; i++) {
            for (let j = 0; j < chances[i]; j++) {
                pool.push(types[i]);
            }
        }
        let rand = Math.round(Math.random() * (pool.length - 1));

        this.itemType = pool[rand];
        this.img = `res/${this.itemType}.png`;

        return this.itemType;
    }
}