import run from "aocrunner";
import { Worker } from "worker_threads";

const parseInput = (rawInput: string) =>
  rawInput
    .trim()
    .split("\n")
    .map((line) => {
      const [state, groups] = line.split(" ");
      return {
        state,
        groups: groups.split(",").map(Number),
      };
    });

const checkRow = (row: string, groups: number[], length: number) => {
  let curr = 0;
  let groupIndex = 0;
  for (let i = 0; i < row.length; i++) {
    if (row.charAt(i) === "#") {
      curr++;
    } else {
      if (curr !== 0) {
        if (curr !== groups[groupIndex]) {
          return false;
        }
        groupIndex++;
      }
      curr = 0;
    }
  }
  if (row.length === length) {
    if (curr !== 0) {
      if (curr !== groups[groupIndex]) {
        return false;
      }
      groupIndex++;
    }
    if (groupIndex !== groups.length) {
      return false;
    }
  }
  return true;
};

const calculateCombinations = (
  current: string,
  original: string,
  groups: number[],
) => {
  if (!checkRow(current, groups, original.length)) {
    return 0;
  }
  if (current.length === original.length) {
    return checkRow(current, groups, original.length) ? 1 : 0;
  }

  let combinations = 0;
  const curr = original.charAt(current.length);
  if (curr === "?") {
    combinations += calculateCombinations(current + ".", original, groups);
    combinations += calculateCombinations(current + "#", original, groups);
  } else {
    combinations += calculateCombinations(current + curr, original, groups);
  }
  return combinations;
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  return input.reduce(
    (acc, row) => calculateCombinations("", row.state, row.groups) + acc,
    0,
  );
};

const part2 = async (rawInput: string) => {
  const input = parseInput(rawInput);
  const threads = 20;
  const chunkSize = Math.ceil(input.length / threads);
  const workers: Promise<number>[] = [];
  for (let i = 0; i < input.length; i += chunkSize) {
    const chunk = input.slice(i, i + chunkSize);
    // console.log(chunk);
    const worker = new Worker("./src/day12/worker.js", {
      workerData: {
        data: chunk,
      },
    });
    workers.push(new Promise((res) => worker.once("message", (x) => res(x))));
  }
  return (await Promise.all(workers)).reduce((a, b) => a + b);
};

run({
  part1: {
    tests: [
      {
        input: `???.### 1,1,3
.??..??...?##. 1,1,3
?#?#?#?#?#?#?#? 1,3,1,6
????.#...#... 4,1,1
????.######..#####. 1,6,5
?###???????? 3,2,1`,
        expected: 21,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `???.### 1,1,3
.??..??...?##. 1,1,3
?#?#?#?#?#?#?#? 1,3,1,6
????.#...#... 4,1,1
????.######..#####. 1,6,5
?###???????? 3,2,1`,
        expected: 525152,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
