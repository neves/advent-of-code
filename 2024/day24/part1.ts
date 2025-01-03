import { readInputSync } from "../lib.ts";

const file = "input";
const [wiresInput, opInput] = readInputSync(import.meta, file).split("\n\n")
  .map((lines) => lines.split("\n"));
const wires = wiresInput.map((line) => line.split(": ")).reduce(
  (acc, [wire, val]) => acc.set(wire, Number(val)),
  new Map(),
);
const ports = opInput.map((line) => line.split(" -> ")).map((
  [op, wire],
) => [op.split(" "), wire]);
console.log(wires, ports);

function raise(wire: string) {
  throw new Error(`Unknown wire: ${wire}`);
}

function evalPort(wire1: string, port: string, wire2: string): number {
  const a = wires.get(wire1) ?? raise(wire1);
  const b = wires.get(wire2) ?? raise(wire2);
  switch (port) {
    case "AND":
      return a && b;
    case "OR":
      return a || b;
    case "XOR":
      return a ^ b;
  }
  throw new Error(`Unknown port: ${port}`);
}

for (const [op, wire] of ports) {
  const [wire1, port, wire2] = op;
  try {
    wires.set(wire, evalPort(wire1, port, wire2));
  } catch {
    ports.push([op, wire]);
  }
}
console.log(
  parseInt(
    Array.from(wires.entries()).filter(([wire]) => wire.startsWith("z"))
      .toSorted(
        (a, b) => b[0].toString().localeCompare(a[0].toString()),
      ).map(([_, v]) => v.toString()).join(""),
    2,
  ),
);
