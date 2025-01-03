const input = (await new Response(Deno.stdin.readable).text()).trim();
const matrix = input.split("\n").map((line) => line.split(""));

function countXmasOnLine(line: string) {
  const regex = /(?=(XMAS))/g
  let count = 0
  while (regex.exec(line)) {
    count++
    regex.lastIndex++
  }
  return count
}

function countXmasOnLineAndReverse(row: string[]) {
  return countXmasOnLine(row.join("")) + countXmasOnLine(row.toReversed().join(""))
}

function diagonal(matrix: string[][], y: number, x: number) {
  return [matrix[y][x], matrix[y + 1]?.[x + 1], matrix[y + 2]?.[x + 2], matrix[y + 3]?.[x + 3]].filter(Boolean)
}

function diagonalReverse(matrix: string[][], y: number, x: number) {
  return [matrix[y][x], matrix[y + 1]?.[x - 1], matrix[y + 2]?.[x - 2], matrix[y + 3]?.[x - 3]].filter(Boolean)
}

let total = 0
// horizontal
for (let y = 0; y < matrix.length; y++) {
  const count = countXmasOnLineAndReverse(matrix[y])
  total += count
}

// vertical
for (let x = 0; x < matrix[0].length; x++) {
  const row = []
  for (let y = 0; y < matrix.length; y++) {
    row.push(matrix[y][x])
  }
  total += countXmasOnLineAndReverse(row)
}

for (let y = 0; y < matrix.length; y++) {
  for (let x = 0; x < matrix[y].length; x++) {
    total += countXmasOnLineAndReverse(diagonal(matrix, y, x))
    total += countXmasOnLineAndReverse(diagonalReverse(matrix, y, x))
  }
}

console.log(total)
