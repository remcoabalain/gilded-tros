import {Item} from './item';

export class ItemHandler {
    public readonly MIN_QUALITY: number = 0;
    public readonly MAX_QUALITY: number = 50;

    // empty array means it can handle every passed item
    readonly handlesItems: string[] = []

    constructor(public item: Item) {
    }

    public canHandleItem() {
        if (this.handlesItems.length === 0) {
            return;
        }

        const itemInArray = this.handlesItems.includes(this.item.name);

        if (!itemInArray) {
            this.throwErrorUnCorrectHandler()
        }
    }

    public throwErrorUnCorrectHandler() {
        throw new Error(`Incorrect handler called for item ${this.item.name}`);
    }

    public update(): void {
        throw new Error('Implement update in subclass');
    }
}

export class StandardHandler extends ItemHandler {
    update() {
        this.item.sellIn -= 1;

        this.item.quality -= 1;

        if (this.item.sellIn < 0) {
            this.item.quality -= 1;
        }

        this.item.quality = Math.min(
            Math.max(this.item.quality, this.MIN_QUALITY),
            this.MAX_QUALITY
        );
    }
}

export class GoodWineHandler extends ItemHandler {
    handlesItems: string[] = ['Good Wine']

    update() {
        this.canHandleItem()

        this.item.sellIn -= 1;
        this.item.quality += 1;

        if (this.item.sellIn < 0) {
            this.item.quality += 1;
        }

        this.item.quality = Math.min(this.item.quality, this.MAX_QUALITY);
    }
}

export class LegendaryHandler extends ItemHandler {
    public readonly MAX_QUALITY: number = 80;

    handlesItems = ['B-DAWG Keychain']

    update() {
        this.canHandleItem();

        // no changes to sellIn or quality for legendary items
        // but always make sure it's MAX_QUALITY
        this.item.quality = this.MAX_QUALITY;
    }
}

export class BackStagePassesHandler extends ItemHandler {
    handlesItems = ['Backstage passes for Re:Factor', 'Backstage passes for HAXX']

    update() {
        this.canHandleItem();

        if (this.item.sellIn > 10) {
            this.item.quality += 1;
        } else if (this.item.sellIn <= 10 && this.item.sellIn > 5) {
            this.item.quality += 2;
        } else if (this.item.sellIn <= 5 && this.item.sellIn > 0) {
            this.item.quality += 3;
        } else {
            this.item.quality = 0;
        }

        /**
         * TODO in the old code the sell in checks for quality mutations are before the sell in mutation,
         * while for Good Wine, the second increase of quality is after the sellIn mutation..
         * which makes the tests react differently for these two cases. Moved the mutation for Backstage for now.
         */
        this.item.sellIn -= 1;

        this.item.quality = Math.min(this.item.quality, this.MAX_QUALITY);
    }
}

export class SmellyHandler extends ItemHandler {
    handlesItems = ['Duplicate Code', 'Long Methods', 'Ugly Variable Names']
    update() {
        this.canHandleItem();
        this.item.sellIn -= 1;
        this.item.quality = Math.max(this.item.quality - 2, this.MIN_QUALITY);
    }
}

export class GildedTros {

    constructor(public items: Array<Item>) {

    }

    private readonly itemHandlers: typeof ItemHandler[] = [
        GoodWineHandler,
        SmellyHandler,
        LegendaryHandler,
        BackStagePassesHandler,
    ]

    private getItemHandler(item: Item): ItemHandler {
        const foundHandler = this.itemHandlers.find((handler) => {
            return (new handler(item)).handlesItems.includes(item.name)
        });

        if (!foundHandler) {
            return new StandardHandler(item);
        }

        return new foundHandler(item);
    }

    public updateQuality(): void {
        this.items.forEach((item: Item) => {
            const handler = this.getItemHandler(item);
            handler.update();
        })
    }
}

