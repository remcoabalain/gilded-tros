import {Item} from './item';

class ItemHandler {
    MIN_QUALITY = 0;
    MAX_QUALITY = 50;

    constructor(public item: Item) {
    }

    public throwErrorUnCorrectHandler() {
        throw new Error(`Incorrect handler called for item ${this.item.name}`)
    }

    public update(): void {
        throw new Error('Implement update in subclass')
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
        )
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
    MAX_QUALITY = 80;
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

        this.item.sellIn -= 1;

        if (this.item.sellIn > 10) {
            this.item.quality += 1;
        } else if (this.item.sellIn <= 10 && this.item.sellIn > 5) {
            this.item.quality += 2;
        } else if (this.item.sellIn <= 5 && this.item.sellIn >= 0) {
            this.item.quality += 3;
        } else {
            this.item.quality = 0;
        }

        this.item.quality = Math.min(this.item.quality, this.MAX_QUALITY);
    }
}

class SmellyHandler extends ItemHandler {
    update() {
        if (!['Duplicate Code', 'Long Methods', 'Ugly Variable Names'].includes(this.item.name)) {
            this.throwErrorUnCorrectHandler();
        }
        this.item.sellIn -= 1;
        this.item.quality = Math.max(this.item.quality - 2, this.MIN_QUALITY)
    }
}

export class GildedTros {

    constructor(public items: Array<Item>) {

    }

    private getItemHandler(item: Item) {
        if (item.name === 'Good Wine') {
            return new GoodWineHandler(item);
        } else if (item.name === 'B-DAWG Keychain') {
            return new LegendaryHandler(item);
        } else if (['Duplicate Code', 'Long Methods', 'Ugly Variable Names'].includes(item.name)) {
            return new SmellyHandler(item);
        } else if (item.name.includes('Backstage passes')) {
            return new BackStagePassesHandler(item);
        }
        return new StandardHandler(item);
    }

    public updateQuality(): void {
        this.items.forEach((item: Item) => {
            const handler = this.getItemHandler(item);
            handler.update();
        })
    }

}

