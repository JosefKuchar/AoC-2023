import run from "aocrunner";

const parseInput = (rawInput: string) =>
  rawInput.split("\n").map((line) => line.split(""));

const getNext = (
  end1: { x: number; y: number },
  end2: { x: number; y: number },
  prev: { x: number; y: number },
) => {
  if (end1.x === prev.x && end1.y === prev.y) {
    return end2;
  } else if (end2.x === prev.x && end2.y === prev.y) {
    return end1;
  }
  return null;
};

const flood = (map: string[][]) => {
  const queue = [{ x: 0, y: 0 }];

  while (queue.length > 0) {
    const curr = queue.shift()!;
    if (
      curr.x < 0 ||
      curr.y < 0 ||
      curr.x >= map[0].length ||
      curr.y >= map.length
    ) {
      continue;
    }

    if (map[curr.y][curr.x] === ".") {
      map[curr.y][curr.x] = "#";
    } else {
      continue;
    }

    queue.push({ ...curr, x: curr.x - 1 });
    queue.push({ ...curr, x: curr.x + 1 });
    queue.push({ ...curr, y: curr.y - 1 });
    queue.push({ ...curr, y: curr.y + 1 });
  }
};

const propagate = (
  map: string[][],
  distances: number[][],
  start: { x: number; y: number },
) => {
  const queue = [{ ...start, distance: 0, prev: start }];

  while (queue.length > 0) {
    const curr = queue.shift()!;
    if (
      curr.x < 0 ||
      curr.y < 0 ||
      curr.x >= map[0].length ||
      curr.y >= map.length
    ) {
      continue;
    }

    const current = map[curr.y][curr.x];
    if (current === ".") {
      continue;
    }

    if (distances[curr.y][curr.x] !== 0) {
      continue;
    }

    switch (current) {
      case "|": {
        const next = getNext(
          { x: curr.x, y: curr.y - 1 },
          { x: curr.x, y: curr.y + 1 },
          curr.prev,
        );
        if (next) {
          distances[curr.y][curr.x] = curr.distance;
          queue.push({ ...next, distance: curr.distance + 1, prev: curr });
        }
        break;
      }
      case "-": {
        const next = getNext(
          { x: curr.x - 1, y: curr.y },
          { x: curr.x + 1, y: curr.y },
          curr.prev,
        );
        if (next) {
          distances[curr.y][curr.x] = curr.distance;
          queue.push({ ...next, distance: curr.distance + 1, prev: curr });
        }
        break;
      }
      case "L": {
        const next = getNext(
          { x: curr.x, y: curr.y - 1 },
          { x: curr.x + 1, y: curr.y },
          curr.prev,
        );
        if (next) {
          distances[curr.y][curr.x] = curr.distance;
          queue.push({ ...next, distance: curr.distance + 1, prev: curr });
        }
        break;
      }
      case "J": {
        const next = getNext(
          { x: curr.x - 1, y: curr.y },
          { x: curr.x, y: curr.y - 1 },
          curr.prev,
        );
        if (next) {
          distances[curr.y][curr.x] = curr.distance;
          queue.push({ ...next, distance: curr.distance + 1, prev: curr });
        }
        break;
      }
      case "7": {
        const next = getNext(
          { x: curr.x - 1, y: curr.y },
          { x: curr.x, y: curr.y + 1 },
          curr.prev,
        );
        if (next) {
          distances[curr.y][curr.x] = curr.distance;
          queue.push({ ...next, distance: curr.distance + 1, prev: curr });
        }
        break;
      }
      case "F": {
        const next = getNext(
          { x: curr.x + 1, y: curr.y },
          { x: curr.x, y: curr.y + 1 },
          curr.prev,
        );
        if (next) {
          distances[curr.y][curr.x] = curr.distance;
          queue.push({ ...next, distance: curr.distance + 1, prev: curr });
        }
        break;
      }
      case "S":
        queue.push({
          ...curr,
          x: curr.x + 1,
          distance: curr.distance + 1,
          prev: curr,
        });
        queue.push({
          ...curr,
          x: curr.x - 1,
          distance: curr.distance + 1,
          prev: curr,
        });
        queue.push({
          ...curr,
          y: curr.y + 1,
          distance: curr.distance + 1,
          prev: curr,
        });
        queue.push({
          ...curr,
          y: curr.y - 1,
          distance: curr.distance + 1,
          prev: curr,
        });
        break;
    }
  }
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const distances = input.map((line) => line.map(() => 0));
  for (let y = 0; y < input.length; y++) {
    for (let x = 0; x < input[y].length; x++) {
      if (input[y][x] === "S") {
        propagate(input, distances, { x, y });
      }
    }
  }
  return Math.max(...distances.flat());
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const distances = input.map((line) => line.map(() => 0));
  for (let y = 0; y < input.length; y++) {
    for (let x = 0; x < input[y].length; x++) {
      if (input[y][x] === "S") {
        propagate(input, distances, { x, y });
      }
    }
  }
  // Clean input
  for (let y = 0; y < input.length; y++) {
    for (let x = 0; x < input[y].length; x++) {
      if (!(input[y][x] === "S" || distances[y][x] !== 0)) {
        input[y][x] = ".";
      }
    }
  }
  // Upsample 3x
  const upsampled = new Array(input.length * 3)
    .fill(0)
    .map((x) => new Array(input[0].length * 3).fill("."));
  for (let y = 0; y < input.length; y++) {
    for (let x = 0; x < input[y].length; x++) {
      const ux = 3 * x + 1;
      const uy = 3 * y + 1;
      switch (input[y][x]) {
        case "-":
          upsampled[uy][ux - 1] = "-";
          upsampled[uy][ux] = "-";
          upsampled[uy][ux + 1] = "-";
          break;
        case "|":
          upsampled[uy - 1][ux] = "|";
          upsampled[uy][ux] = "|";
          upsampled[uy + 1][ux] = "|";
          break;
        case "L":
          upsampled[uy - 1][ux] = "|";
          upsampled[uy][ux] = "L";
          upsampled[uy][ux + 1] = "-";
          break;
        case "F":
          upsampled[uy][ux + 1] = "-";
          upsampled[uy][ux] = "F";
          upsampled[uy + 1][ux] = "|";
          break;
        case "J":
          upsampled[uy][ux - 1] = "-";
          upsampled[uy][ux] = "J";
          upsampled[uy - 1][ux] = "|";
          break;
        case "7":
          upsampled[uy][ux - 1] = "-";
          upsampled[uy][ux] = "7";
          upsampled[uy + 1][ux] = "|";
          break;
        case "S":
          upsampled[uy][ux] = "S";
          upsampled[uy - 1][ux] = "|";
          upsampled[uy + 1][ux] = "|";
          upsampled[uy][ux - 1] = "-";
          upsampled[uy][ux + 1] = "-";
          break;
      }
    }
  }
  // Flood
  flood(upsampled);
  // Downsample 3x
  for (let y = 0; y < input.length; y++) {
    for (let x = 0; x < input[y].length; x++) {
      input[y][x] = upsampled[y * 3 + 1][x * 3 + 1];
    }
  }
  return input.flat().filter((char) => char === ".").length;
};

run({
  part1: {
    tests: [
      {
        input: `.....
.S-7.
.|.|.
.L-J.
.....`,
        expected: 4,
      },
      {
        input: `..F7.
.FJ|.
SJ.L7
|F--J
LJ...`,
        expected: 8,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `...........
.S-------7.
.|F-----7|.
.||.....||.
.||.....||.
.|L-7.F-J|.
.|..|.|..|.
.L--J.L--J.
...........`,
        expected: 4,
      },
      {
        input: `.F----7F7F7F7F-7....
.|F--7||||||||FJ....
.||.FJ||||||||L7....
FJL7L7LJLJ||LJ.L-7..
L--J.L7...LJS7F-7L7.
....F-J..F7FJ|L7L7L7
....L7.F7||L7|.L7L7|
.....|FJLJ|FJ|F7|.LJ
....FJL-7.||.||||...
....L---J.LJ.LJLJ...`,
        expected: 8,
      },
      {
        input: `FF7FSF7F7F7F7F7F---7
L|LJ||||||||||||F--J
FL-7LJLJ||||||LJL-77
F--JF--7||LJLJ7F7FJ-
L---JF-JLJ.||-FJLJJ7
|F|F-JF---7F7-L7L|7|
|FFJF7L7F-JF7|JL---7
7-L-JL7||F7|L7F-7F7|
L.L7LFJ|||||FJL7||LJ
L7JLJL-JLJLJL--JLJ.L`,
        expected: 10,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  // onlyTests: true,
});
