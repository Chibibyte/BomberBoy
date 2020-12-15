import { Block } from "./gameDevLib/Blocks/Block.js";
import { Container } from "./gameDevLib/Blocks/Container.js";
import { BlockCollectionStack } from "./gameDevLib/BlockCollectionStack.js";

/**
 * Display Info text on InfoBoard that gets updated (e.g. score, lives, time)
 */
export class InfoItem extends Block {
    constructor(ctx, width = 100, height = 100, initValue = "initValue", prefix = "prefix", suffix = "suffix", fontSize = 100, textColor = "white", fontWeight = "200") {
        super(ctx, 0, 0, width, height);
        this.initValue = initValue;
        this.value = initValue;
        this.prefix = prefix;
        this.suffix = suffix;
        this.fontSize = fontSize;
        this.textColor = textColor;
        this.fontWeight = 900;

        this.color = "transparent";

        this.borderColor = "green";
        this.borderSize = 1;


    }

    draw() {
        super.draw();
        this.drawCenterText(this.prefix + this.value + this.suffix, this.fontSize, this.textColor, true, this.fontWeight);
    }
}

/**
 * InfoBoard
 * 
 * Information board at the top of every level.
 * Displays relevant information like lives, points, time left, etc...
 */
export class InfoBoard extends Block {
    constructor(ctx, x = 0, y = 0, width = 100, height = 100, color = "black", textColor = "white", itemDirection = "h", fontSize = 100) {
        super(ctx, x, y, width, height, color);
        this.infoItems = {};
        this.textColor = textColor;
        this.fontSize = fontSize;
        this.itemDirection = itemDirection;

        this.container = new Container(ctx);
        this.appendChild(this.container);

        let dividerHeight = 12;

        this.divider = new Block(ctx, 0, 100 - dividerHeight, 100, dividerHeight, "white");
        this.divider.borderSize = 2;
        this.divider.height = dividerHeight - this.divider.borderSize;
        this.divider.drawBorder = true;
        this.divider.borderColor = "black"
        this.appendChild(this.divider);
    }

    update() {
        let items = Object.values(this.infoItems);
        items.forEach(item => {
            item.textColor = this.textColor;
            item.fontSize = this.fontSize;

        })
        super.update();
    }

    addItem(infoItem, name) {
        this.infoItems[name ? name : infoItem.key] = infoItem;
        this.container.appendContainerChild(infoItem);
    }
}