import run from "aocrunner";

const parseInput = (rawInput: string) =>
  rawInput
    .trim()
    .split("\n")
    .map((line) => line.split(""));

const isAdjacent = (
  input: string[][],
  x: number,
  y: number,
  cmpFn: (val: string) => boolean,
) => {
  for (let i = x - 1; i <= x + 1; i++) {
    for (let j = y - 1; j <= y + 1; j++) {
      if (
        (i === x && j === y) ||
        i < 0 ||
        j < 0 ||
        i >= input.length ||
        j >= input[i].length
      ) {
        continue;
      }
      if (cmpFn(input[j][i]) && isNaN(input[j][i] as any)) {
        return `${i},${j}`;
      }
    }
  }
  return "";
};

const solve = (rawInput: string, cmpFn: (val: string) => boolean) => {
  const input = parseInput(rawInput);
  let data: { [key: string]: number[] } = {};
  for (let y = 0; y < input.length; y++) {
    let currentNumber = "";
    let coords = "";
    for (let x = 0; x < input[y].length; x++) {
      if (!isNaN(input[y][x] as any)) {
        currentNumber += input[y][x];
        const adjacent = isAdjacent(input, x, y, cmpFn);
        if (adjacent) {
          coords = adjacent;
        }
      } else {
        if (currentNumber.length > 0 && coords !== "") {
          if (!data[coords]) {
            data[coords] = [];
          }
          data[coords].push(parseInt(currentNumber));
        }
        coords = "";
        currentNumber = "";
      }
    }
    if (currentNumber.length > 0 && coords !== "") {
      if (!data[coords]) {
        data[coords] = [];
      }
      data[coords].push(parseInt(currentNumber));
    }
  }
  return data;
};

const part1 = (rawInput: string) => {
  const data = solve(rawInput, (val) => val !== ".");
  return Object.values(data).reduce(
    (acc, coord) => coord.reduce((acc, val) => acc + val, 0) + acc,
    0,
  );
};

const part2 = (rawInput: string) => {
  const data = solve(rawInput, (val) => val === "*");
  return Object.values(data).reduce(
    (acc, gear) =>
      (gear as any).length === 2
        ? (gear as any)[0] * (gear as any)[1] + (acc as any)
        : acc,
    0,
  );
};

run({
  part1: {
    tests: [
      {
        input: `467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..`,
        expected: 4361,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..`,
        expected: 467835,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
