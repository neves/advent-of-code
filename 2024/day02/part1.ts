const input = (await new Response(Deno.stdin.readable).text()).trim();
const reports = input.split("\n").map((line) => line.split(" ").map(Number));

function adjacentDiff(report: number[], min: number, max: number) {
  return report.every((n, i) =>
    i === 0 || (Math.abs(n - report[i - 1]) >= min &&
      Math.abs(n - report[i - 1]) <= max)
  );
}

function isAllIncreasing(report: number[]) {
  return report.every((n, i) => i === 0 || n > report[i - 1]);
}

function isAllDecreasing(report: number[]) {
  return report.every((n, i) => i === 0 || n < report[i - 1]);
}

console.assert(
  reports.filter((report) =>
    adjacentDiff(report, 1, 3) &&
    (isAllIncreasing(report) || isAllDecreasing(report))
  ).length === 524,
);
