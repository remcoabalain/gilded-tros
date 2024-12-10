import {Item} from '../src/item';
import {GildedTros} from '../src/gilded-tros';

describe('GildedTrosTest', () => {
    describe('Standard drinks', () => {

        it('should decrease item quality and sellIn', () => {
            const items: Item[] = [new Item('Fine wine', 10, 9)]
            const app: GildedTros = new GildedTros(items);
            app.updateQuality();
            expect(app.items[0].sellIn).toEqual(9);
            expect(app.items[0].quality).toEqual(8);
        });

        it('should decrease item quality twice as fast if sellIn has passed', () => {
            const items: Item[] = [
                new Item('Fine wine', 0, 9),
            ]
            const app: GildedTros = new GildedTros(items);
            app.updateQuality();
            expect(app.items[0].sellIn).toEqual(-1);
            expect(app.items[0].quality).toEqual(7);
        });

        it('should never decrease item quality past zero', () => {
            const items: Item[] = [
                new Item('Fine wine', 0, 0),
            ]
            const app: GildedTros = new GildedTros(items);
            app.updateQuality();
            expect(app.items[0].sellIn).toEqual(-1);
            expect(app.items[0].quality).toEqual(0);
        });
    });

    describe('Legendary drinks', () => {
        it('should never have quality above 50 if the item isn\'t legendary', () => {
            const items: Item[] = [
                new Item('Fine wine', 10, 55),
            ]
            const app: GildedTros = new GildedTros(items);
            app.updateQuality();
            expect(app.items[0].sellIn).toEqual(9);
            expect(app.items[0].quality).toEqual(50);
        });

        it('should never decrease quality and sellIn if the item is legendary', () => {
            const items: Item[] = [
                new Item('B-DAWG Keychain', 10, 80),
            ]
            const app: GildedTros = new GildedTros(items);
            app.updateQuality();
            expect(app.items[0].sellIn).toEqual(10);
            expect(app.items[0].quality).toEqual(80);
        });
    });

    describe('Good Wine', () => {
        it('should increase quality if it\'s Good Wine', () => {
            const items: Item[] = [
                new Item('Good Wine', 1, 15),
            ]
            const app: GildedTros = new GildedTros(items);
            app.updateQuality();
            expect(app.items[0].sellIn).toEqual(0);
            expect(app.items[0].quality).toEqual(16);
        });

        it('should increase quality twice as fast if it\'s Good Wine and passed sellIn', () => {
            const items: Item[] = [
                new Item('Good Wine', 0, 15),
            ]
            const app: GildedTros = new GildedTros(items);
            app.updateQuality();
            expect(app.items[0].sellIn).toEqual(-1);
            expect(app.items[0].quality).toEqual(17);
        });
    });

    describe('Backstage passes', () => {
        it('should increase quality by 1 if sell bigger than 10', () => {
            const items: Item[] = [
                new Item('Backstage passes for Re:Factor', 11, 20),
            ]
            const app: GildedTros = new GildedTros(items);
            app.updateQuality();
            expect(app.items[0].sellIn).toEqual(10);
            expect(app.items[0].quality).toEqual(21);
        });

        it('should increase quality by 2 if sell in between 6 and 10', () => {
            const items: Item[] = [
                new Item('Backstage passes for Re:Factor', 10, 20),
                new Item('Backstage passes for Re:Factor', 9, 20),
                new Item('Backstage passes for Re:Factor', 8, 20),
                new Item('Backstage passes for Re:Factor', 7, 20),
                new Item('Backstage passes for Re:Factor', 6, 20),
            ]
            const app: GildedTros = new GildedTros(items);
            app.updateQuality();
            expect(app.items[0].sellIn).toEqual(9);
            expect(app.items[0].quality).toEqual(22);

            expect(app.items[1].sellIn).toEqual(8);
            expect(app.items[1].quality).toEqual(22);

            expect(app.items[2].sellIn).toEqual(7);
            expect(app.items[2].quality).toEqual(22);

            expect(app.items[3].sellIn).toEqual(6);
            expect(app.items[3].quality).toEqual(22);

            expect(app.items[4].sellIn).toEqual(5);
            expect(app.items[4].quality).toEqual(22);
        });

        it('should increase quality by 3 if sell in between 0 and 5', () => {
            const items: Item[] = [
                new Item('Backstage passes for Re:Factor', 5, 20),
                new Item('Backstage passes for Re:Factor', 4, 20),
                new Item('Backstage passes for Re:Factor', 3, 20),
                new Item('Backstage passes for Re:Factor', 2, 20),
                new Item('Backstage passes for Re:Factor', 1, 20),
            ]
            const app: GildedTros = new GildedTros(items);
            app.updateQuality();
            expect(app.items[0].sellIn).toEqual(4);
            expect(app.items[0].quality).toEqual(23);

            expect(app.items[1].sellIn).toEqual(3);
            expect(app.items[1].quality).toEqual(23);

            expect(app.items[2].sellIn).toEqual(2);
            expect(app.items[2].quality).toEqual(23);

            expect(app.items[3].sellIn).toEqual(1);
            expect(app.items[3].quality).toEqual(23);

            expect(app.items[4].sellIn).toEqual(0);
            expect(app.items[4].quality).toEqual(23);
        });

        it('should set quality to zero if sell in is passed 0', () => {
            const items: Item[] = [
                new Item('Backstage passes for Re:Factor', 0, 20),
            ]
            const app: GildedTros = new GildedTros(items);
            app.updateQuality();
            expect(app.items[0].sellIn).toEqual(-1);
            expect(app.items[0].quality).toEqual(0);
        });
    });

    describe('Smelly items', () => {
        it('should decrease quality twice as fast', () => {
            const items: Item[] = [
                new Item('Duplicate Code', 7, 18),
                new Item('Long Methods', 5, 14),
                new Item('Ugly Variable Names', 10, 20),
            ]

            const app: GildedTros = new GildedTros(items);
            app.updateQuality();

            expect(app.items[0].sellIn).toEqual(6);
            expect(app.items[0].quality).toEqual(16)

            expect(app.items[1].sellIn).toEqual(4);
            expect(app.items[1].quality).toEqual(12)

            expect(app.items[2].sellIn).toEqual(9);
            expect(app.items[2].quality).toEqual(18);
        })

        it('should never decrease item quality past zero', () => {
            const items: Item[] = [
                new Item('Duplicate Code', 7, 0),
            ]

            const app: GildedTros = new GildedTros(items);
            app.updateQuality();

            expect(app.items[0].sellIn).toEqual(6);
            expect(app.items[0].quality).toEqual(0)
        })
    });
});
