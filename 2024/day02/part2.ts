const input = (await new Response(Deno.stdin.readable).text()).trim();
const reports = input.split("\n").map((line) => line.split(" ").map(Number));

const adjacentDiff = (report: number[], min: number, max: number) =>
  report.every((n, i) =>
    i === 0 || (Math.abs(n - report[i - 1]) >= min &&
      Math.abs(n - report[i - 1]) <= max)
  );

const isAllIncreasing = (report: number[]) =>
  report.every((n, i) => i === 0 || n > report[i - 1]);

const isAllDecreasing = (report: number[]) =>
  report.every((n, i) => i === 0 || n < report[i - 1]);

const check = (report: number[]) =>
  adjacentDiff(report, 1, 3) &&
  (isAllIncreasing(report) || isAllDecreasing(report));

function safe(report: number[]) {
  if (check(report)) return true;

  for (let i = 0; i < report.length; i++) {
    const clone = [...report];
    clone.splice(i, 1);
    if (check(clone)) return true;
  }
  return false;
}

console.assert(reports.filter(safe).length === 569);
