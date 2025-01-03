export function readInputSync(
  meta: { resolve: (path: string) => string },
  filename = "input",
): string {
  return Deno.readTextFileSync(
    meta.resolve(`./${filename}.txt`).replace("file://", ""),
  ).trim();
}

export class YX {
  constructor(public y: number, public x: number) {}

  distanceTo(yx: YX) {
    return new YX(yx.y - this.y, yx.x - this.x);
  }

  toString() {
    return `(${this.y},${this.x})`;
  }
}

export class Grid<GI extends GridItem<GI>> {
  constructor(public matrix: string[][]) {}

  static instance(matrix: string[][]) {
    return new Grid(matrix);
  }

  itemInstance(...args: ConstructorParameters<typeof GridItem<GI>>) {
    return new GridItem(...args);
  }

  static fromInput(input: string) {
    return this.instance(
      input
        .trim()
        .split("\n")
        .map((line) => line.split("")),
    );
  }

  *items<T extends GridItem<GI>>() {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        yield this.itemInstance(y, x, this.get(y, x), this) as T;
      }
    }
  }

  get width() {
    return this.matrix[0].length;
  }

  get height() {
    return this.matrix.length;
  }

  isInsideYX(yx: YX) {
    return this.isInside(yx.y, yx.x);
  }

  isInside(y: number, x: number) {
    return y >= 0 && y < this.height && x >= 0 && x < this.width;
  }

  get(y: number, x: number) {
    return this.matrix[y]?.[x];
  }

  set(y: number, x: number, symbol: string) {
    if (this.isInside(y, x)) {
      this.matrix[y][x] = symbol;
    }
    return this;
  }

  at(yx: YX) {
    return this.get(yx.y, yx.x);
  }

  itemAt<GI>(yx: YX): GI | null {
    const symbol = this.at(yx);
    if (!symbol) return null;
    const item = this.itemInstance(yx.y, yx.x, symbol, this);
    return item as GI;
  }

  put(yx: YX, symbol: string) {
    return this.set(yx.y, yx.x, symbol);
  }

  clone() {
    return new Grid(this.matrix.map((line) => [...line]));
  }

  print() {
    console.log(this.toString());
    return this;
  }

  toString() {
    const padding = (this.height - 1).toString().length;
    let y = 0;
    const xs = new Array(this.width)
      .fill(0, 0, this.width)
      .map((_, i) => i % 10)
      .join(" ");
    const header = " ".repeat(padding + 1) + xs + "\n" + " ".repeat(padding) +
      "┌" + "─".repeat(this.width * 2 - 1) + "┐";
    const footer = " ".repeat(padding) + "└" + "─".repeat(this.width * 2 - 1) +
      "┘" + "\n" + " ".repeat(padding + 1) + xs;
    return header + "\n" + this.matrix.map(
      (line) =>
        y.toString().padStart(padding, "0") + "│" + line.join(" ") + "│" +
        (y++).toString().padStart(padding, "0"),
    ).join("\n") + "\n" + footer;
  }
}

export class GridItem<GI extends GridItem<GI>> extends YX {
  constructor(
    public override y: number,
    public override x: number,
    public symbol: string,
    protected grid: Grid<GI>,
  ) {
    super(y, x);
    Object.defineProperty(this, "grid", { enumerable: false });
  }

  up() {
    return this.grid.itemAt<GI>(new YX(this.y - 1, this.x));
  }

  down() {
    return this.grid.itemAt<GI>(new YX(this.y + 1, this.x));
  }

  left() {
    return this.grid.itemAt<GI>(new YX(this.y, this.x - 1));
  }

  right() {
    return this.grid.itemAt<GI>(new YX(this.y, this.x + 1));
  }

  neighbors(): GI[] {
    return [this.up(), this.right(), this.down(), this.left()].filter((item) =>
      item !== null
    ) as GI[];
  }

  override toString() {
    return `${super.toString()}:${this.symbol}`;
  }
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
