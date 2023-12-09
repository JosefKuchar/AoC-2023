import run from "aocrunner";

const parseInput = (rawInput: string) =>
  rawInput
    .trim()
    .split("\n")
    .map((line) => line.split(" ").map(Number));

const solve = (
  rawInput: string,
  reduceFn: (acc: number, cur: number[]) => number,
) =>
  parseInput(rawInput).reduce((acc, cur) => {
    const predictions = [cur];
    while (predictions[predictions.length - 1].some((n) => n != 0)) {
      const last = predictions[predictions.length - 1];
      let next = [];
      for (let i = 0; i < last.length - 1; i++) {
        next.push(last[i + 1] - last[i]);
      }
      predictions.push(next);
    }
    return predictions.reverse().reduce(reduceFn, 0) + acc;
  }, 0);

const part1 = (rawInput: string) =>
  solve(rawInput, (acc, curr) => acc + curr[curr.length - 1]);

const part2 = (rawInput: string) =>
  solve(rawInput, (acc, curr) => curr[0] - acc);

run({
  part1: {
    tests: [
      {
        input: `0 3 6 9 12 15
1 3 6 10 15 21
10 13 16 21 30 45`,
        expected: 114,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `0 3 6 9 12 15
1 3 6 10 15 21
10 13 16 21 30 45`,
        expected: 2,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
