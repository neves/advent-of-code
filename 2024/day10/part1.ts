import { Grid, GridItem, readInputSync } from "../lib.ts";

const input = readInputSync(import.meta, "input");

class Tile extends GridItem<Tile> {
  get height() {
    return Number(this.symbol);
  }

  nextTiles() {
    return this.neighbors().filter((item) => item.height === this.height + 1);
  }

  get ids9(): string[] {
    if (this.height === 9) return [this.toString()];
    return this.nextTiles().flatMap((tile) => tile.ids9);
  }

  get score() {
    return new Set(this.ids9).size;
  }

  get rating() {
    return this.ids9.length;
  }

  // trail(): Tile[] {
  //   const next = this.nextTiles().map((tile) => tile.trail());
  //   return next;
  // }
}

class TMap extends Grid<Tile> {
  static override instance(matrix: string[][]) {
    return new TMap(matrix);
  }

  override itemInstance(...args: ConstructorParameters<typeof GridItem<Tile>>) {
    return new Tile(...args);
  }

  static override fromInput(input: string): TMap {
    return super.fromInput(input) as TMap;
  }
  get trailheads() {
    return this.items<Tile>().filter((item) => item.symbol === "0");
  }
}

const grid = TMap.fromInput(input);

console.log(
  grid.trailheads.reduce((a, b) => a + b.score, 0),
);
console.log(
  grid.trailheads.reduce((a, b) => a + b.rating, 0),
);
