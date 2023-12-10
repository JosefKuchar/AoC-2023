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

const propagate = (
  map: string[][],
  distances: number[][],
  start: { x: number; y: number },
) => {
  const queue = [{ ...start, distance: 0, prev: start }];

  while (queue.length > 0) {
    const curr = queue.shift()!;
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

  return;
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
  onlyTests: false,
});
