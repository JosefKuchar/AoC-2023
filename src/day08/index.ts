import run from "aocrunner";

const parseInput = (rawInput: string) => {
  const [directions, rawRules] = rawInput.trim().split("\n\n");
  const rules: { [key: string]: { left: string; right: string } } = {};
  rawRules.split("\n").forEach((line) => {
    const [_, start, left, right] = line.match(/(\w+) = \((\w+), (\w+)\)/)!;
    rules[start] = { left, right };
  });
  return {
    directions: directions.split(""),
    rules,
  };
};

const lcm = (a: number, b: number) => (a * b) / gcm(a, b);
const gcm = (a: number, b: number): number => {
  const remainder = a % b;
  if (remainder === 0) return b;
  return gcm(b, remainder);
};

const solve = (
  rawInput: string,
  state: string,
  endFn: (str: string) => boolean,
) => {
  const input = parseInput(rawInput);
  let steps = 0;
  for (let i = 0; !endFn(state); i++, i %= input.directions.length) {
    if (input.directions[i] === "L") {
      state = input.rules[state].left;
    } else {
      state = input.rules[state].right;
    }
    steps++;
  }
  return steps;
};

const part1 = (rawInput: string) =>
  solve(rawInput, "AAA", (str) => str === "ZZZ");

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  let steps = Object.keys(input.rules)
    .filter((rule) => rule.charAt(2) === "A")
    .map((start) => solve(rawInput, start, (str) => str.charAt(2) === "Z"));
  return steps.reduce((a, b) => lcm(a, b));
};

run({
  part1: {
    tests: [
      {
        input: `RL

AAA = (BBB, CCC)
BBB = (DDD, EEE)
CCC = (ZZZ, GGG)
DDD = (DDD, DDD)
EEE = (EEE, EEE)
GGG = (GGG, GGG)
ZZZ = (ZZZ, ZZZ)`,
        expected: 2,
      },
      {
        input: `LLR

AAA = (BBB, BBB)
BBB = (AAA, ZZZ)
ZZZ = (ZZZ, ZZZ)`,
        expected: 6,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `LR

11A = (11B, XXX)
11B = (XXX, 11Z)
11Z = (11B, XXX)
22A = (22B, XXX)
22B = (22C, 22C)
22C = (22Z, 22Z)
22Z = (22B, 22B)
XXX = (XXX, XXX)`,
        expected: 6,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
