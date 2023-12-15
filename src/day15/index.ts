import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput.trim().split(",");

type Lens = {
  name: string;
  focalLength: number;
};

const doHash = (input: string) => {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash += input.charCodeAt(i);
    hash *= 17;
    hash %= 256;
  }
  return hash;
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  return input.reduce((acc, cur) => doHash(cur) + acc, 0);
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const boxes: { [key: number]: Lens[] } = {};

  input.forEach((action) => {
    const [_, name, op, focalLength] = action.match(/(\w+)([=-])(\d)?/)!;
    const hash = doHash(name);
    if (op === "=") {
      if (!boxes[hash]) {
        boxes[hash] = [];
      }
      const index = boxes[hash].findIndex((lens) => lens.name === name);
      if (index === -1) {
        boxes[hash].push({ name, focalLength: Number(focalLength) });
      } else {
        boxes[hash][index].focalLength = Number(focalLength);
      }
    } else if (op === "-") {
      if (boxes[hash]) {
        const index = boxes[hash].findIndex((lens) => lens.name === name);
        if (index !== -1) {
          boxes[hash].splice(index, 1);
        }
      }
    }
  });
  return Object.entries(boxes).reduce(
    (acc, [index, curr]) =>
      curr.reduce(
        (acc, lens, slot) =>
          (Number(index) + 1) * (slot + 1) * lens.focalLength + acc,
        0,
      ) + acc,
    0,
  );
};

run({
  part1: {
    tests: [
      {
        input: `rn=1,cm-,qp=3,cm=2,qp-,pc=4,ot=9,ab=5,pc-,pc=6,ot=7`,
        expected: 1320,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `rn=1,cm-,qp=3,cm=2,qp-,pc=4,ot=9,ab=5,pc-,pc=6,ot=7`,
        expected: 145,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
