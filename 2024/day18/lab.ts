import { readInputSync, sleep } from "../lib.ts";

const file = "input";
const slice = file === "sample" ? 12 : 1024;
const input = readInputSync(import.meta, file).split("\n").slice(0, slice).map((
  line,
) => line.split(",").map(Number));
const width = file === "sample" ? 7 : 71;
const matrix = new Array(width * width).fill(0);
input.map(([x, y]) => y * width + x).forEach((i) => matrix[i] = 1);

function at(x: number, y: number) {
  const value = y < 0 || y >= width || x < 0 || x >= width
    ? 1
    : matrix[y * width + x];

  return {
    x,
    y,
    value,
    setValue(v: number) {
      matrix[y * width + x] = v;
    },
  };
}

function neighbors(x: number, y: number) {
  return [at(x + 1, y), at(x, y + 1), at(x - 1, y), at(x, y - 1)].filter((p) =>
    p.value === 0
  );
}

function printMap() {
  const CHARS = [".", "#", "0", "+"];

  for (let y = 0; y < width; y++) {
    console.log(
      matrix
        .slice(y * width, y * width + width)
        .map((v) => CHARS[v])
        .join(" "),
    );
  }
}

async function navigate(
  { x, y }: { x: number; y: number },
): Promise<number[][] | null> {
  if (x === width - 1 && y === width - 1) {
    return [[x, y]];
  }
  at(x, y).setValue(3);
  console.clear();
  printMap();
  await sleep(1);
  let best = null;
  for (const n of neighbors(x, y)) {
    const path: number[][] | null = await navigate(n);
    if (path && (best === null || path.length < best.length)) {
      best = path;
    }
  }
  at(x, y).setValue(0);
  if (best) best.unshift([x, y]);
  return best;
}

const steps = await navigate({ x: 0, y: 0 });
console.log(steps?.length);
steps?.map(([x, y]) => matrix[y * width + x] = 2);

printMap();
