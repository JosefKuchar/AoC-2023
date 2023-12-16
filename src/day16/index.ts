import run from "aocrunner";

type Beam = {
  x: number;
  y: number;
  dx: number;
  dy: number;
};

const parseInput = (rawInput: string) =>
  rawInput
    .trim()
    .split("\n")
    .map((line) => line.split(""));

const solve = (
  input: string[][],
  startX: number,
  startY: number,
  startDX: number,
  startDY: number,
) => {
  const queue: Beam[] = [{ x: startX, y: startY, dx: startDX, dy: startDY }];
  const seen = new Set<string>();
  const seenWithDir = new Set<string>();

  while (queue.length > 0) {
    const { x, y, dx, dy } = queue.shift()!;
    if (x < 0 || y < 0 || x >= input[0].length || y >= input.length) {
      continue;
    }
    seen.add(`${x},${y}`);
    if (seenWithDir.has(`${x},${y},${dx},${dy}`)) {
      continue;
    }
    seenWithDir.add(`${x},${y},${dx},${dy}`);
    switch (input[y][x]) {
      case ".":
        queue.push({ x: x + dx, y: y + dy, dx, dy });
        break;
      case "\\":
        if (dx === 1) {
          queue.push({ x, y: y + 1, dx: 0, dy: 1 });
        } else if (dx === -1) {
          queue.push({ x, y: y - 1, dx: 0, dy: -1 });
        } else if (dy === 1) {
          queue.push({ x: x + 1, y, dx: 1, dy: 0 });
        } else if (dy === -1) {
          queue.push({ x: x - 1, y, dx: -1, dy: 0 });
        }
        break;
      case "/":
        if (dx === 1) {
          queue.push({ x, y: y - 1, dx: 0, dy: -1 });
        } else if (dx === -1) {
          queue.push({ x, y: y + 1, dx: 0, dy: 1 });
        } else if (dy === 1) {
          queue.push({ x: x - 1, y, dx: -1, dy: 0 });
        } else if (dy === -1) {
          queue.push({ x: x + 1, y, dx: 1, dy: 0 });
        }
        break;
      case "-":
        if (dy !== 0) {
          queue.push({ x: x - 1, y, dx: -1, dy: 0 });
          queue.push({ x: x + 1, y, dx: 1, dy: 0 });
        } else {
          queue.push({ x: x + dx, y: y + dy, dx, dy });
        }
        break;
      case "|":
        if (dx !== 0) {
          queue.push({ x, y: y - 1, dx: 0, dy: -1 });
          queue.push({ x, y: y + 1, dx: 0, dy: 1 });
        } else {
          queue.push({ x: x + dx, y: y + dy, dx, dy });
        }
        break;
    }
  }
  return seen.size;
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  return solve(input, 0, 0, 1, 0);
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  let max = 0;
  for (let y = 0; y < input.length; y++) {
    const left = solve(input, 0, y, 1, 0);
    if (left > max) {
      max = left;
    }
    const right = solve(input, input[0].length - 1, y, -1, 0);
    if (right > max) {
      max = right;
    }
  }
  for (let x = 0; x < input[0].length; x++) {
    const top = solve(input, x, 0, 0, 1);
    if (top > max) {
      max = top;
    }
    const bottom = solve(input, x, input.length - 1, 0, -1);
    if (bottom > max) {
      max = bottom;
    }
  }
  return max;
};

run({
  part1: {
    tests: [
      {
        input: `.|...\\....
|.-.\\.....
.....|-...
........|.
..........
.........\\
..../.\\\\..
.-.-/..|..
.|....-|.\\
..//.|....`,
        expected: 46,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `.|...\\....
|.-.\\.....
.....|-...
........|.
..........
.........\\
..../.\\\\..
.-.-/..|..
.|....-|.\\
..//.|....`,
        expected: 51,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
