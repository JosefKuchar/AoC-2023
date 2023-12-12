import run from "aocrunner";

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
          return null;
        }
        groupIndex++;
      } else {
        if (curr > groups[groupIndex]) {
          return null;
        }
      }
      curr = 0;
    }
  }
  if (row.length === length) {
    if (curr !== 0) {
      if (curr !== groups[groupIndex]) {
        return null;
      }
      groupIndex++;
    }
    if (groupIndex !== groups.length) {
      return null;
    }
  }
  return { groupIndex, curr };
};

const calculateCombinations = (
  current: string,
  original: string,
  groups: number[],
  cache: Map<string, number> = new Map(),
) => {
  const rest = original.substring(current.length);
  const check = checkRow(current, groups, original.length);
  if (check === null) {
    return 0;
  }
  if (current.length === original.length) {
    return check !== null ? 1 : 0;
  }
  if (cache.has(`${rest}-${check.groupIndex}-${check.curr}`)) {
    return cache.get(`${rest}-${check.groupIndex}-${check.curr}`)!;
  }
  let combinations = 0;
  const currChar = original.charAt(current.length);
  if (currChar === "?") {
    combinations += calculateCombinations(
      current + ".",
      original,
      groups,
      cache,
    );
    combinations += calculateCombinations(
      current + "#",
      original,
      groups,
      cache,
    );
  } else {
    combinations += calculateCombinations(
      current + currChar,
      original,
      groups,
      cache,
    );
  }
  cache.set(`${rest}-${check.groupIndex}-${check.curr}`, combinations);
  return combinations;
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  return input.reduce(
    (acc, row) => calculateCombinations("", row.state, row.groups) + acc,
    0,
  );
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  return input.reduce((acc, row) => {
    let newState = row.state;
    let newGroups = row.groups;
    for (let i = 0; i < 4; i++) {
      newState += "?" + row.state;
      newGroups = [...newGroups, ...row.groups];
    }
    return calculateCombinations("", newState, newGroups) + acc;
  }, 0);
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
