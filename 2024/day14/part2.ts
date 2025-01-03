import { Grid, GridItem, readInputSync } from "../lib.ts";

const input = readInputSync(import.meta, "input");
// const input = "p=2,4 v=2,-3";

// const wide = 11;
// const tall = 7;
const wide = 101;
const tall = 103;
const elapsed = 10403;

const grid: Grid<GridItem<Robot>> = Grid.fromInput(
  (".".repeat(wide) + "\n").repeat(tall),
) as Grid<GridItem<Robot>>;

class Robot extends GridItem<Robot> {
  originalX: number;
  originalY: number;
  moves = 0;
  constructor(
    x: number,
    y: number,
    public vx: number,
    public vy: number,
    grid: Grid<Robot>,
  ) {
    super(y, x, "#", grid);
    this.originalX = x;
    this.originalY = y;
    this.grid.put(this, "#");
  }

  move() {
    this.grid.put(this, ".");
    const x = (this.x + this.vx) % wide;
    this.x = x < 0 ? wide + x : x;
    const y = (this.y + this.vy) % tall;
    this.y = y < 0 ? tall + y : y;
    this.grid.put(this, "#");
    this.moves++;
    if (this.x === this.originalX && this.y === this.originalY) {
      console.log(this.toString(), this.moves);
    }
  }
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const robots = input.split("\n").map((line) =>
  line.matchAll(/\-?\d+/g).map((a) => Number(a[0])).toArray()
).map(([x, y, vx, vy]) => new Robot(x, y, vx, vy, grid));

for (let i = 0; i < elapsed; i++) {
  console.clear();
  grid.print();
  console.log(i);
  if (i > 6666) await sleep(1000);
  robots.forEach((r) => r.move());
}
grid.print();
