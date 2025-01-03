const input = (await new Response(Deno.stdin.readable).text()).trim();
const operations: [bigint, bigint[]][] = input.split("\n").map((line) => line.split(":")).map(
  (pair) => [BigInt(pair[0]), pair[1].trim().split(" ").map(BigInt)]
);

function calc(n: number, numbers: bigint[]) {
  const ops = n.toString(2).padStart(numbers.length - 1, "0").split("")
  return numbers.reduce((p, c) => ops.pop() === "1" ? p * c : p + c)
}

// console.log(operations);
const count: Record<string, number> = {}
let sum = 0n
for (const op of operations) {
  // count[op[1].length] = count[op[1].length] ?? 0
  // count[op[1].length] += 1
  const a = op[1]
  let n = parseInt("1".repeat(a.length - 1), 2)
  do {
    const r = calc(n, a)
    if (r === op[0]) {
      sum += r
      break
    }
    n--
  } while (n >= 0)

}

console.log(sum)

// console.log(35n*8n*6n*1n*3n*9n*11n*8n*8n*3n*2n*5n)
// console.log(35n+8n+6n+1n+3n+9n+11n+8n+8n+3n+2n+5n)
