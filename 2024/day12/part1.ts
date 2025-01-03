import { Grid, GridItem, readInputSync } from "../lib.ts";

const input = readInputSync(import.meta, "input");

class Plant extends GridItem<Plant> {
  visited = false;

  plots() {
    return this.neighbors().filter((n) => n.symbol === this.symbol);
  }

  unvisitedPlots() {
    return this.plots().filter((n) => !n.visited);
  }

  *region(): Generator<Plant> {
    if (!this.visited) {
      this.visited = true;
      yield this;
      for (const neighbor of this.unvisitedPlots()) {
        yield* neighbor.region();
      }
      // this.visited = false;
    }
  }

  get perimeter() {
    // this.visited = true;
    const neighbors = this.neighbors();
    // neighbors.filter((n) => n.symbol === this.symbol).forEach((n) =>
    //   n.visited = true
    // );
    return 4 - neighbors.length +
      neighbors.filter((n) => n.symbol !== this.symbol).length;
  }
}

class Garden extends Grid<Plant> {
  singleton = new Map<string, Plant>();

  static instance(matrix: string[][]) {
    return new Garden(matrix);
  }

  itemInstance(...args: ConstructorParameters<typeof Plant>) {
    const key = `${args[0]},${args[1]}`;
    if (this.singleton.has(key)) {
      return this.singleton.get(key)!;
    }
    const plant = new Plant(...args);
    this.singleton.set(key, plant);
    return plant;
  }
}

const grid = Garden.fromInput(input);
// grid.print();
let price = 0;
for (const plant of grid.items<Plant>()) {
  if (plant.visited) continue;
  const region = Array.from(plant.region());
  const area = region.length;
  const perimeter = region.reduce((a, b) => a + b.perimeter, 0);
  price += area * perimeter;
}
console.log(price);
// console.log(
//   plants,
//   Object.values(plants).map((
//     ary,
//   ) => [ary.length, ary, ary.reduce((a, b) => a + b)]),
//   // Object.values(plants).reduce(
//   //   (a, b) => a + b.length * b.reduce((a, b) => a + b, 0),
//   //   0,
//   // ),
// );
