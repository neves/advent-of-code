const input = (await new Response(Deno.stdin.readable).text()).trim();
const operations: [bigint, bigint[]][] = input.split("\n").map((line) => line.split(":")).map(
  (pair) => [BigInt(pair[0]), pair[1].trim().split(" ").map(BigInt)]
);

function operate(op: string | undefined, a: bigint, b: bigint) {
  switch (op) {
    case "2": return BigInt(a.toString() + b.toString())
    case "1": return a * b
    default: return a + b
  }
}

function calc(n: number, numbers: bigint[]) {
  const ops = n.toString(3).padStart(numbers.length - 1, "0").split("")
  return numbers.reduce((p, c) => operate(ops.shift(), p, c))
}

// console.log(operations);
const count: Record<string, number> = {}
let sum = 0n
for (const op of operations) {
  // count[op[1].length] = count[op[1].length] ?? 0
  // count[op[1].length] += 1
  const a = op[1]
  let n = parseInt("2".repeat(a.length - 1), 3)
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
