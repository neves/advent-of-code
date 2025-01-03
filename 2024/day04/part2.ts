const input = (await new Response(Deno.stdin.readable).text()).trim();
const matrix = input.split("\n").map((line) => line.split(""));

let total = 0

for (let y = 1; y < matrix.length - 1; y++) {
  for (let x = 1; x < matrix[y].length - 1; x++) {
    const char = matrix[y][x]
    if (char !== "A") continue
    if ([matrix[y-1][x-1], matrix[y+1][x+1]].sort().join("") === "MS" && [matrix[y+1][x-1], matrix[y-1][x+1]].sort().join("") === "MS") {
      total += 1
    }
  }
}

console.log(total)
