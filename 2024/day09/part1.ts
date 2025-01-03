import { readInputSync } from "../lib.ts";

function combineArrays(a: string[][], b: string[][]) {
  const result = [];
  const maxLength = Math.max(a.length, b.length);

  for (let i = 0; i < maxLength; i++) {
    if (i < a.length) result.push(a[i]); // Add from 'a' to odd position
    if (i < b.length) result.push(b[i]); // Add from 'b' to even position
  }

  return result;
}

const input = readInputSync(import.meta, "sample").trim().split("").map(Number);

const files = input.filter((_, i) => i % 2 === 0).map((size, id) =>
  new Array(size).fill(id)
);

const free = input.filter((_, i) => i % 2 === 1).map((size) =>
  new Array(size).fill(".")
);

const combined = combineArrays(files, free).flat();

let j = combined.length - 1;
for (let i = 0; i < combined.length; i++) {
  if (combined[i] === ".") {
    while (combined[j] === ".") {
      j--;
    }
    if (j > i) {
      combined[i] = combined[j];
      combined[j] = ".";
    }
    j--;
  }
  if (j <= i) break;
}

const defrag = combined.filter((c) => c != ".");

function checksum(defrag: string[]) {
  return defrag
    .map((n, i) => Number(n) * i)
    .reduce((a, b) => a + b);
}

console.log(checksum(defrag));
