function changeStone(stone: string): string[] {
  if (stone === "0") return ["1"];
  if (stone.length % 2 === 0) {
    return [
      stone.substring(0, stone.length / 2),
      Number(stone.substring(stone.length / 2)).toString(),
    ];
  }
  return [(Number(stone) * 2024).toString()];
}

function* decompose(
  stones: string[],
  blinks: number,
): Generator<string[]> {
  if (blinks === 0) return;
  const results: string[] = [];
  for (const stone of stones) {
    results.push(...changeStone(stone));
  }
  yield results;
  yield* decompose(results, blinks - 1);
}

let blinks = 0;

const input = ["0" /* "234", "928434", "14", "0", "7", "92446", "8992692"*/];
const lengths = [];
for (const stones of decompose(input, 25)) {
  blinks++;
  lengths.push(stones.length);
  console.log(blinks, stones.length);
}

console.log(JSON.stringify(lengths));
