import { Unit } from "./Unit.js";

/**
 * Only weapon of the player
 * It has a timer, an explosion size and the option to be a remote detonation bomb
 */
export class Bomb extends Unit {
    /**
     * 
     * @param {*} ctx                   Canvas context
     * @param {number} timer            Bomb timer in seconds
     * @param {number} explosionSize    Explosion radius in number of grid fields
     * @param {boolean} remoteBomb      Wheather or not the bomb will be remote detonatable
     */
    constructor(ctx, timer = 2, explosionSize = 1, remoteBomb = false) {
        super(ctx);
        this.verbose = false;
        this.timer = timer;
        this.explosionSize = explosionSize;
        this.collision = true;
        this.img = remoteBomb ? 'res/remoteBomb.png' : "res/bomb.png";

        this.unitType = "bomb";
        this.exploded = false;
        this.remoteBomb = remoteBomb;

        if (!this.remoteBomb) this.bombTimeout = setTimeout(() => {
            this.explode();

        }, timer * 1000)

        this.collisionReactions = [this.defaultCollisionReaction.bind(this),
        this.explosionCollisionReaction.bind(this)];
    }

    /**
     * Reaction to colliding with the hitbox of an explosion (e.g. for chainractions)
     * 
     * @param {Unit} collisionUnit      Unit the bomb collided with
     */
    explosionCollisionReaction(collisionUnit) {
        if (collisionUnit.unitType == "explosion") {
            this.explode();
            return false;
        }
        return true;
    }

    /**
     * Activates explosion
     */
    explode() {
        if (this.exploded) return;
        this.exploded = true;
    }

}