const input = (await new Response(Deno.stdin.readable).text()).trim();
const instructions = input.matchAll(/mul\(\d{1,3},\d{1,3}\)/g).toArray().map(
  (a) => a[0]
);
instructions.forEach((instruction) => console.log(instruction));
console.log(instructions.length)
console.log(
  instructions.map((instruction) =>
    instruction.matchAll(/\d+/g).toArray().map((a) => Number(a[0]))
  ).map(([a, b]) => a * b).reduce((a, b) => a + b),
);
// 701 178794710
