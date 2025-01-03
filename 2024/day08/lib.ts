import { Grid, GridItem, YX } from "../lib.ts";

export const input = Deno.readTextFileSync(
  import.meta.resolve("./input.txt").replace("file://", ""),
).trim();

export const grid = Grid.fromInput(input);

export class Antenna extends YX {
  public frequency: string = "";

  resonate(b: Antenna): Antinode[] {
    if (this.frequency !== b.frequency) return [];
    return [
      this.resonateBefore(b),
      this.resonateAfter(b),
    ].filter(Boolean) as Antinode[];
  }

  *resonateHarmonics(b: Antenna, grid: Grid) {
    for (const antinode of this.resonateHarmonicsBefore(b)) {
      if (!grid.isInsideYX(antinode)) break;
      yield antinode;
    }
    for (const antinode of this.resonateHarmonicsAfter(b)) {
      if (!grid.isInsideYX(antinode)) break;
      yield antinode;
    }
  }

  *resonateHarmonicsBefore(b: Antenna) {
    let a: Antenna = this;
    while (true) {
      const antinode = a.resonateBefore(b);
      if (!antinode) break;
      yield antinode;
      b = a;
      a = new Antenna(antinode.y, antinode.x);
      a.frequency = b.frequency;
    }
  }

  *resonateHarmonicsAfter(b: Antenna) {
    let a: Antenna = this;
    while (true) {
      const antinode = a.resonateAfter(b);
      if (!antinode) break;
      yield antinode;
      a = b;
      b = new Antenna(antinode.y, antinode.x);
      b.frequency = a.frequency;
    }
  }

  resonateBefore(b: Antenna) {
    if (this.frequency !== b.frequency) return null;
    const d = this.distanceTo(b);
    return new Antinode(this.y - d.y, this.x - d.x);
  }

  resonateAfter(b: Antenna) {
    if (this.frequency !== b.frequency) return null;
    const d = this.distanceTo(b);
    return new Antinode(b.y + d.y, b.x + d.x);
  }

  static from(item: GridItem) {
    const yx = new Antenna(item.y, item.x);
    yx.frequency = item.symbol;
    return yx;
  }

  override toString() {
    return `${super.toString()}:${this.frequency}`;
  }
}

export class Antinode extends YX {}
