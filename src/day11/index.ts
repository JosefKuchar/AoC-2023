import run from "aocrunner";

const parseInput = (rawInput: string) =>
  rawInput
    .trim()
    .split("\n")
    .map((x) => x.split(""));

const solve = (rawInput: string, multiplier: number) => {
  const input = parseInput(rawInput);
  const galaxies = [];
  for (let y = 0; y < input.length; y++) {
    for (let x = 0; x < input[y].length; x++) {
      if (input[y][x] === "#") {
        galaxies.push({ x, y });
      }
    }
  }
  const newGalaxies: typeof galaxies = JSON.parse(JSON.stringify(galaxies));
  for (let i = 0; i < input.length; i++) {
    if (!galaxies.some((g) => g.x === i)) {
      galaxies.forEach((g, index) => {
        if (g.x > i) {
          newGalaxies[index].x += multiplier - 1;
        }
      });
    }
  }
  for (let i = 0; i < input[0].length; i++) {
    if (!galaxies.some((g) => g.y === i)) {
      galaxies.forEach((g, index) => {
        if (g.y > i) {
          newGalaxies[index].y += multiplier - 1;
        }
      });
    }
  }
  let sum = 0;
  for (let i = 0; i < newGalaxies.length; i++) {
    for (let j = i + 1; j < newGalaxies.length; j++) {
      sum +=
        Math.abs(newGalaxies[i].x - newGalaxies[j].x) +
        Math.abs(newGalaxies[i].y - newGalaxies[j].y);
    }
  }
  return sum;
};

const part1 = (rawInput: string) => solve(rawInput, 2);

const part2 = (rawInput: string) => solve(rawInput, 1000000);

run({
  part1: {
    tests: [
      {
        input: `...#......
.......#..
#.........
..........
......#...
.#........
.........#
..........
.......#..
#...#.....`,
        expected: 374,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `...#......
.......#..
#.........
..........
......#...
.#........
.........#
..........
.......#..
#...#.....`,
        expected: 82000210,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
