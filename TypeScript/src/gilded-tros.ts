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

        this.item.quality = Math.max(this.item.quality, this.MIN_QUALITY)
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

    public updateQuality(): void {
        for (let i = 0; i < this.items.length; i++) {
            if (this.items[i].name != 'Good Wine' && this.items[i].name != 'Backstage passes for Re:Factor'
                && this.items[i].name != 'Backstage passes for HAXX') {
                if (this.items[i].quality > 0) {
                    if (this.items[i].name != 'B-DAWG Keychain') {
                        this.items[i].quality = this.items[i].quality - 1;
                    }
                }
            } else {
                if (this.items[i].quality < 50) {
                    this.items[i].quality = this.items[i].quality + 1;

                    if (this.items[i].name == 'Backstage passes for Re:Factor') {
                        if (this.items[i].sellIn < 11) {
                            if (this.items[i].quality < 50) {
                                this.items[i].quality = this.items[i].quality + 1;
                            }
                        }

                        if (this.items[i].sellIn < 6) {
                            if (this.items[i].quality < 50) {
                                this.items[i].quality = this.items[i].quality + 1;
                            }
                        }
                    }
                }
            }

            if (this.items[i].name != 'B-DAWG Keychain') {
                this.items[i].sellIn = this.items[i].sellIn - 1;
            }

            if (this.items[i].sellIn < 0) {
                if (this.items[i].name != 'Good Wine') {
                    if (this.items[i].name != 'Backstage passes for Re:Factor' || this.items[i].name != 'Backstage passes for HAXX') {
                        if (this.items[i].quality > 0) {
                            if (this.items[i].name != 'B-DAWG Keychain') {
                                this.items[i].quality = this.items[i].quality - 1;
                            }
                        }
                    } else {
                        this.items[i].quality = this.items[i].quality - this.items[i].quality;
                    }
                } else {
                    if (this.items[i].quality < 50) {
                        this.items[i].quality = this.items[i].quality + 1;
                    }
                }
            }
        }
    }

}

