// https://adventofcode.com/2024/day/1
// https://adventofcode.com/2024/day/1/input

const input = await Deno.readTextFile("sum-diff.input.txt")
const {left, right} = input.trim()
  .split("\n")
  .map(line => line.split("   ").map(Number))
  .reduce((acc, [a, b]) => {
    acc.left.push(a)
    acc.right.push(b)
    return acc
  }, {left: [], right: []})

left.sort()
right.sort()

let bi = 0
function countInRightList(n: number) {
  let count = 0
  while (bi < right.length && right[bi] <= n) {
    if (right[bi] === n) {
      count++
    }
    bi++
  }
  return count
}

let diffSum = 0
for (let i = 0; i < left.length; i++) {
  diffSum += Math.abs(left[i] - right[i])
}

console.log(diffSum)

let similarityScore = 0
for (let i = 0; i < left.length; i++) {
  similarityScore += left[i] * countInRightList(left[i])
}

console.log(similarityScore)
