const input = (await new Response(Deno.stdin.readable).text()).trim();
const instructions = input.matchAll(/mul\(\d{1,3},\d{1,3}\)|don't\(\)|do\(\)/g).toArray().map(
  (a) => a[0]
);
instructions.forEach((instruction) => console.log(instruction));
console.log(instructions.length)

let enabled = true
const enabledInstructions = instructions.filter((instruction) => {
  if (instruction === "don't()") {
    enabled = false
    return false
  }
  if (instruction === "do()") {
    enabled = true
    return false
  }
  return enabled
})

console.log(enabledInstructions.length)

console.log(
  enabledInstructions.map((instruction) =>
    instruction.matchAll(/\d+/g).toArray().map((a) => Number(a[0]))
  ).map(([a, b]) => a * b).reduce((a, b) => a + b),
);

// 280 76729637
