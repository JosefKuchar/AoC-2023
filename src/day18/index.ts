import run from "aocrunner";

const parseInput = (rawInput: string) =>
  rawInput.split("\n").map((line) => {
    const [direction, steps, hexSteps] = line.split(" ");
    return {
      direction,
      steps: Number(steps),
      hexSteps: parseInt(hexSteps.slice(2, hexSteps.length - 2), 16),
      hexDirection: Number(hexSteps.charAt(hexSteps.length - 2)),
    };
  });

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  let coords: { x: number; y: number }[] = [{ x: 0, y: 0 }];
  let x = 0;
  let y = 0;
  let area = 0;
  input.forEach(({ direction, steps }) => {
    switch (direction) {
      case "R":
        x += steps;
        break;
      case "L":
        x -= steps;
        break;
      case "U":
        y -= steps;
        break;
      case "D":
        y += steps;
        break;
    }
    area += steps;
    coords.push({ x, y });
  });

  // Calculate area
  for (let i = 0; i < coords.length - 1; i++) {
    area += coords[i].x * coords[i + 1].y - coords[i + 1].x * coords[i].y;
  }
  area +=
    coords[coords.length - 1].x * coords[0].y -
    coords[0].x * coords[coords.length - 1].y;
  return Math.abs(area / 2) + 1;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  let coords: { x: number; y: number }[] = [{ x: 0, y: 0 }];
  let x = 0;
  let y = 0;
  let area = 0;
  input.forEach(({ hexDirection, hexSteps }) => {
    switch (hexDirection) {
      case 0:
        x += hexSteps;
        break;
      case 2:
        x -= hexSteps;
        break;
      case 3:
        y -= hexSteps;
        break;
      case 1:
        y += hexSteps;
        break;
    }
    area += hexSteps;
    coords.push({ x, y });
  });
  // Calculate area
  for (let i = 0; i < coords.length - 1; i++) {
    area += coords[i].x * coords[i + 1].y - coords[i + 1].x * coords[i].y;
  }
  area +=
    coords[coords.length - 1].x * coords[0].y -
    coords[0].x * coords[coords.length - 1].y;
  return Math.abs(area / 2) + 1;
};

run({
  part1: {
    tests: [
      {
        input: `R 6 (#70c710)
D 5 (#0dc571)
L 2 (#5713f0)
D 2 (#d2c081)
R 2 (#59c680)
D 2 (#411b91)
L 5 (#8ceee2)
U 2 (#caa173)
L 1 (#1b58a2)
U 2 (#caa171)
R 2 (#7807d2)
U 3 (#a77fa3)
L 2 (#015232)
U 2 (#7a21e3)`,
        expected: 62,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `R 6 (#70c710)
D 5 (#0dc571)
L 2 (#5713f0)
D 2 (#d2c081)
R 2 (#59c680)
D 2 (#411b91)
L 5 (#8ceee2)
U 2 (#caa173)
L 1 (#1b58a2)
U 2 (#caa171)
R 2 (#7807d2)
U 3 (#a77fa3)
L 2 (#015232)
U 2 (#7a21e3)`,
        expected: 952408144115,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  // onlyTests: true,
});
