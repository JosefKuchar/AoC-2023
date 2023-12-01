import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput.trim().split("\n");

const numberMap = {
  "1": "1",
  "2": "2",
  "3": "3",
  "4": "4",
  "5": "5",
  "6": "6",
  "7": "7",
  "8": "8",
  "9": "9",
};

const wordMap = {
  one: "1",
  two: "2",
  three: "3",
  four: "4",
  five: "5",
  six: "6",
  seven: "7",
  eight: "8",
  nine: "9",
};

const solve = (rawInput: string, map: Record<string, string>) => {
  const input = parseInput(rawInput);
  return input.reduce((acc, curr) => {
    let minIndex = Number.MAX_VALUE;
    let maxIndex = -1;
    let first = "";
    let last = "";
    Object.entries(map).forEach(([key, value]) => {
      const index = curr.indexOf(key);
      if (index !== -1 && index < minIndex) {
        minIndex = index;
        first = value;
      }
      const lastIndex = curr.lastIndexOf(key);
      if (lastIndex !== -1 && lastIndex > maxIndex) {
        maxIndex = lastIndex;
        last = value;
      }
    });
    return parseInt(first + last) + acc;
  }, 0);
};

const part1 = (rawInput: string) => solve(rawInput, numberMap);

const part2 = (rawInput: string) =>
  solve(rawInput, { ...wordMap, ...numberMap });

run({
  part1: {
    tests: [
      {
        input: `1abc2
pqr3stu8vwx
a1b2c3d4e5f
treb7uchet`,
        expected: 142,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `two1nine
eightwothree
abcone2threexyz
xtwone3four
4nineeightseven2
zoneight234
7pqrstsixteen`,
        expected: 281,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
