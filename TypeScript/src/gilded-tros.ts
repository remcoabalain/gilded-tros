import {Item} from './item';

class ItemHandler {
    public readonly MIN_QUALITY: number = 0;
    public readonly MAX_QUALITY: number = 50;

    constructor(public item: Item) {
    }

    public throwErrorUnCorrectHandler() {
        throw new Error(`Incorrect handler called for item ${this.item.name}`);
    }

    public update(): void {
        throw new Error('Implement update in subclass');
    }
}

class StandardHandler extends ItemHandler {
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

class GoodWineHandler extends ItemHandler {
    update() {
        if (this.item.name != 'Good Wine') {
            this.throwErrorUnCorrectHandler();
        }

        this.item.sellIn -= 1;
        this.item.quality += 1;

        if (this.item.sellIn < 0) {
            this.item.quality += 1;
        }

        this.item.quality = Math.min(this.item.quality, this.MAX_QUALITY);
    }
}

class LegendaryHandler extends ItemHandler {
    public readonly MAX_QUALITY: number = 80;

    update() {
        if (this.item.name != 'B-DAWG Keychain') {
            this.throwErrorUnCorrectHandler();
        }

        // no changes to sellIn or quality for legendary items
        // but always make sure it's MAX_QUALITY
        this.item.quality = this.MAX_QUALITY;
    }
}

class BackStagePassesHandler extends ItemHandler {
    update() {
        if (!this.item.name.includes('Backstage passes')) {
            this.throwErrorUnCorrectHandler()
        }

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

class SmellyHandler extends ItemHandler {
    update() {
        if (!['Duplicate Code', 'Long Methods', 'Ugly Variable Names'].includes(this.item.name)) {
            this.throwErrorUnCorrectHandler();
        }
        this.item.sellIn -= 1;
        this.item.quality = Math.max(this.item.quality - 2, this.MIN_QUALITY);
    }
}

export class GildedTros {

    constructor(public items: Array<Item>) {

    }

    private readonly itemHandlerMapping: {
        isMatch: (name: string) => boolean,
        handler: typeof ItemHandler,
    }[] = [
        {
            isMatch: (name: string) => name === 'Good Wine',
            handler: GoodWineHandler,
        },
        {
            isMatch: (name: string) => name === 'B-DAWG Keychain',
            handler: LegendaryHandler,
        },
        {
            isMatch: (name: string) => ['Duplicate Code', 'Long Methods', 'Ugly Variable Names'].includes(name),
            handler: SmellyHandler,
        },
        {
            isMatch: (name: string) => name.includes('Backstage passes'),
            handler: BackStagePassesHandler,
        },
    ]

    private getItemHandler(item: Item): ItemHandler {
        const foundHandler = this.itemHandlerMapping.find(({isMatch}) => isMatch(item.name));

        if (!foundHandler) {
            return new StandardHandler(item);
        }

        return new foundHandler.handler(item);
    }

    public updateQuality(): void {
        this.items.forEach((item: Item) => {
            const handler = this.getItemHandler(item);
            handler.update();
        })
    }
}

