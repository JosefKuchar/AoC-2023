import run from "aocrunner";

const parseInput = (rawInput: string) => {
  const rawNumbers = rawInput
    .trim()
    .split("\n")
    .map((line) =>
      line
        .split(/\s+/)
        .filter((_, i) => i != 0)
        .map(Number),
    );
  return rawNumbers[0].map((time, i) => ({
    time,
    distance: rawNumbers[1][i],
  }));
};

const getWays = (time: number, distance: number) => {
  let ways = 0;
  let acceleration = 0;
  for (let i = 0; i < time; i++) {
    if ((time - i) * acceleration > distance) {
      ways++;
    }
    acceleration++;
  }
  return ways;
};

const part1 = (rawInput: string) =>
  parseInput(rawInput).reduce(
    (acc, { time, distance }) => getWays(time, distance) * acc,
    1,
  );

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const { time, distance } = input.reduce(
    (acc, { time, distance }) => ({
      time: acc.time + time,
      distance: acc.distance + distance,
    }),
    { time: "", distance: "" },
  );
  return getWays(Number(time), Number(distance));
};

run({
  part1: {
    tests: [
      {
        input: `Time:      7  15   30
Distance:  9  40  200`,
        expected: 288,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `Time:      7  15   30
Distance:  9  40  200`,
        expected: 71503,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
