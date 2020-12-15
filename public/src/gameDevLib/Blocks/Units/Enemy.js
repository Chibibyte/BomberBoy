import { RoamingUnit } from "./RoamingUnit.js";

/**
 * Basic enemy type that moves around and kills on touch
 */
export class Enemy extends RoamingUnit {
    /**
     * 
     * @param {*} ctx       
     * @param {number} points       Points for killing this enemy
     */
    constructor(ctx, points = 100) {
        super(ctx);

        this.img = "res/enemy1.png";
        this.speed = 0.4;
        this.unitType = "enemy";
        this.points = points;

        this.collisionReactions = [this.defaultCollisionReaction.bind(this),
        this.explosionCollisionReaction.bind(this),
        this.bombCollisionReaction.bind(this)];
    }

    /**
     * Reaction on colliding with an explosion hitbox
     * 
     * @param {Unit} collisionUnit 
     */
    explosionCollisionReaction(collisionUnit) {
        if (collisionUnit.unitType == "explosion") {
            this.lifeState = 'dead';
            return false;
        }
        return true;
    }
}