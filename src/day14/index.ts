import run from "aocrunner";

const parseInput = (rawInput: string) =>
  rawInput
    .trim()
    .split("\n")
    .map((line) => line.split(""));

const updateState = (state: string[][], dirX: number, dirY: number) => {
  let nextState = new Array(state.length)
    .fill(0)
    .map(() => new Array(state[0].length).fill("."));
  while (true) {
    // State update rules
    for (let y = 0; y < state.length; y++) {
      for (let x = 0; x < state[0].length; x++) {
        if (state[y][x] === "O") {
          if (dirY !== 0) {
            if (
              y + dirY >= 0 &&
              y + dirY < state.length &&
              state[y + dirY][x] === "."
            ) {
              nextState[y + dirY][x] = "O";
            } else {
              nextState[y][x] = "O";
            }
          } else if (dirX !== 0) {
            if (
              x + dirX >= 0 &&
              x + dirX < state[y].length &&
              state[y][x + dirX] === "."
            ) {
              nextState[y][x + dirX] = "O";
            } else {
              nextState[y][x] = "O";
            }
          }
        } else if (state[y][x] === "#") {
          nextState[y][x] = "#";
        }
      }
    }
    // Check if state is stable
    let stable = true;
    for (let y = 0; y < state.length; y++) {
      for (let x = 0; x < state[0].length; x++) {
        if (state[y][x] !== nextState[y][x]) {
          stable = false;
          break;
        }
      }
    }
    if (stable) {
      return state;
    }
    // Update state
    state = nextState;
    nextState = new Array(state.length)
      .fill(0)
      .map(() => new Array(state[0].length).fill("."));
  }
};

const calculateScore = (state: string[][]) =>
  state.reduce(
    (acc, row, rowIndex) =>
      row.reduce(
        (acc, cell) => (cell === "O" ? acc + row.length - rowIndex : acc),
        0,
      ) + acc,
    0,
  );

const part1 = (rawInput: string) => {
  let state = parseInput(rawInput);
  state = updateState(state, 0, -1);
  return calculateScore(state);
};

const part2 = (rawInput: string) => {
  let state = parseInput(rawInput);
  let cycleCount = 0;
  const states = new Set<string>();
  let stateString = "";

  // Find cycle
  while (true) {
    state = updateState(state, 0, -1);
    state = updateState(state, -1, 0);
    state = updateState(state, 0, 1);
    state = updateState(state, 1, 0);
    cycleCount++;
    stateString = state.map((row) => row.join("")).join("");
    if (states.has(stateString)) {
      break;
    }
    states.add(stateString);
  }
  // Find cycle length
  let cycleLength = 0;
  while (true) {
    state = updateState(state, 0, -1);
    state = updateState(state, -1, 0);
    state = updateState(state, 0, 1);
    state = updateState(state, 1, 0);
    cycleCount++;
    cycleLength++;
    const stateStr = state.map((row) => row.join("")).join("");
    if (stateString === stateStr) {
      break;
    }
  }
  // Do remaining cycles
  let remainingCycles = (1000000000 - cycleCount) % cycleLength;
  for (let i = 0; i < remainingCycles; i++) {
    state = updateState(state, 0, -1);
    state = updateState(state, -1, 0);
    state = updateState(state, 0, 1);
    state = updateState(state, 1, 0);
  }
  return calculateScore(state);
};

run({
  part1: {
    tests: [
      {
        input: `O....#....
O.OO#....#
.....##...
OO.#O....O
.O.....O#.
O.#..O.#.#
..O..#O..O
.......O..
#....###..
#OO..#....`,
        expected: 136,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `O....#....
O.OO#....#
.....##...
OO.#O....O
.O.....O#.
O.#..O.#.#
..O..#O..O
.......O..
#....###..
#OO..#....`,
        expected: 64,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
