import run from "aocrunner";

const parseInput = (rawInput: string) =>
  rawInput
    .trim()
    .split("\n")
    .map((line) => {
      const [_, rawNumbers] = line.split(": ");
      const parts = rawNumbers.split(" | ");
      return parts.map((part) => part.split(/\s+/).map(Number));
    });

const getScore = (winCount: number) => {
  if (winCount === 0) {
    return 0;
  }
  return Math.pow(2, winCount - 1);
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  return input.reduce(
    (acc, [winning, our]) =>
      getScore(winning.filter((w) => our.includes(w)).length) + acc,
    0,
  );
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const duplicates: { [key: number]: number } = {};
  return input.reduce((acc, [winning, our], index) => {
    const wins = winning.filter((w) => our.includes(w)).length;
    duplicates[index] = duplicates[index] || 0;
    const d = duplicates[index];
    if (wins > 0) {
      for (let i = 0; i < wins; i++) {
        duplicates[index + i + 1] = (duplicates[index + i + 1] || 0) + d + 1;
      }
    }
    return acc + duplicates[index] + 1;
  }, 0);
};

run({
  part1: {
    tests: [
      {
        input: `Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11`,
        expected: 13,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11`,
        expected: 30,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
