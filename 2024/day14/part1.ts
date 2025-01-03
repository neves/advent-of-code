import { readInputSync } from "../lib.ts";

const input = readInputSync(import.meta, "input");
// const input = "p=2,4 v=2,-3";

// const wide = 11;
// const tall = 7;
const wide = 101;
const tall = 103;
const wideMiddle = Math.floor(wide / 2);
const tallMiddle = Math.floor(tall / 2);
console.log(wideMiddle, tallMiddle);
const elapsed = 100;

console.log(
  input.split("\n").map((line) =>
    line.matchAll(/\-?\d+/g).map((a) => Number(a[0])).toArray()
  ).map((
    [x, y, vx, vy],
  ) => [(x + vx * elapsed) % wide, (y + vy * elapsed) % tall])
    .map(([x, y]) => [x < 0 ? wide + x : x, y < 0 ? tall + y : y])
    .filter(([x, y]) => y !== tallMiddle && x !== wideMiddle)
    .map(([x, y]) => [x > wideMiddle, y > tallMiddle].join(""))
    .reduce((map, v) => map.set(v, 1 + (map.get(v) ?? 0)), new Map()).values()
    .reduce((a, b) => a * b),
);
