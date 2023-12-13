import run from "aocrunner";

const parseInput = (rawInput: string) =>
  rawInput
    .trim()
    .split("\n\n")
    .map((pattern) => pattern.split("\n").map((line) => line.split("")));

const solve = (rawInput: string, exactSmudges: number) => {
  const input = parseInput(rawInput);
  let columns = 0;
  let rows = 0;
  input.forEach((pattern) => {
    for (let i = 0; i < pattern[0].length - 1; i++) {
      let smudges = 0;
      for (let j = 0; ; j++) {
        const leftIndex = i - j;
        const rightIndex = i + j + 1;
        if (leftIndex < 0 || rightIndex >= pattern[0].length) {
          break;
        }
        for (let k = 0; k < pattern.length; k++) {
          if (pattern[k][leftIndex] !== pattern[k][rightIndex]) {
            smudges++;
          }
        }
      }
      if (smudges === exactSmudges) {
        columns += i + 1;
      }
    }
    for (let i = 0; i < pattern.length - 1; i++) {
      let smudges = 0;
      for (let j = 0; ; j++) {
        const leftIndex = i - j;
        const rightIndex = i + j + 1;
        if (leftIndex < 0 || rightIndex >= pattern.length) {
          break;
        }
        for (let k = 0; k < pattern[0].length; k++) {
          if (pattern[leftIndex][k] !== pattern[rightIndex][k]) {
            smudges++;
          }
        }
      }
      if (smudges === exactSmudges) {
        rows += i + 1;
      }
    }
  });
  return columns + rows * 100;
};

const part1 = (rawInput: string) => solve(rawInput, 0);

const part2 = (rawInput: string) => solve(rawInput, 1);

run({
  part1: {
    tests: [
      {
        input: `#.##..##.
..#.##.#.
##......#
##......#
..#.##.#.
..##..##.
#.#.##.#.

#...##..#
#....#..#
..##..###
#####.##.
#####.##.
..##..###
#....#..#`,
        expected: 405,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `#.##..##.
..#.##.#.
##......#
##......#
..#.##.#.
..##..##.
#.#.##.#.

#...##..#
#....#..#
..##..###
#####.##.
#####.##.
..##..###
#....#..#`,
        expected: 400,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
