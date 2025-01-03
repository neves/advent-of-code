const input = (await new Response(Deno.stdin.readable).text()).trim();
const lines = input.split("\n");

const rules = lines.filter((line) => line.includes("|")).map((line) =>
  line.split("|").map(Number)
).reduce((acc, [a, b]) => {
  acc[`${a}|${b}`] = -1;
  acc[`${b}|${a}`] = 1;
  return acc;
}, {} as Record<string, number>);

const updates = lines.filter((line) => line.includes(",")).map((line) =>
  line.split(",").map(Number)
);

function sort(update: number[]) {
  return update.toSorted((a, b) => {
    return rules[`${a}|${b}`] || rules[`${b}|${a}`] || 0;
  })
}

function isUpdateInWrongOrder(update: number[]) {
  return update.join(",") !== sort(update).join(",");
}

console.log(
  updates.filter(isUpdateInWrongOrder).map(sort).reduce(
    (acc, updates) => acc + updates[Math.floor(updates.length / 2)],
    0,
  ),
);
