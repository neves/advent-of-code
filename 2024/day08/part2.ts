import { Antenna, grid } from "./lib.ts";

grid
  .items()
  .filter((item) => item.symbol !== ".")
  .map((item) => Antenna.from(item))
  .toArray()
  .flatMap((antenna, i, antennas) =>
    antennas
      .slice(i + 1)
      .flatMap((other) => antenna.resonateHarmonics(other, grid).toArray())
  ).map((antinode) => grid.put(antinode, "#"));

console.log(
  grid
    .items()
    .filter((item) => item.symbol !== ".")
    .toArray()
    .length,
);
