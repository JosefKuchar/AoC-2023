import run from "aocrunner";

type Round = {
  [key: string]: number;
};

type Game = {
  id: number;
  rounds: Round[];
};

const parseInput = (rawInput: string): Game[] =>
  rawInput
    .trim()
    .split("\n")
    .map((line) => {
      const parts = line.split(": ");
      const id = parseInt(parts[0].split(" ")[1]);
      const rounds = parts[1].split("; ").map((round) => {
        const roundParts = round.split(", ");
        const roundObj: Round = {};
        roundParts.forEach((part) => {
          const [count, color] = part.split(" ");
          roundObj[color] = parseInt(count);
        });
        return roundObj;
      });
      return {
        id,
        rounds,
      };
    });

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const bag: any = {
    red: 12,
    green: 13,
    blue: 14,
  };
  return input.reduce(
    (acc, game) =>
      game.rounds.every((round) =>
        Object.keys(round).every((color) => round[color] <= bag[color]),
      )
        ? acc + game.id
        : acc,
    0,
  );
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return input.reduce(
    (acc, game) =>
      Object.values(
        game.rounds.reduce(
          (acc, round) => {
            const newAcc = { ...acc };
            Object.keys(round).forEach((color) => {
              if (round[color] > newAcc[color]) {
                newAcc[color] = round[color];
              }
            });
            return newAcc;
          },
          {
            red: 0,
            green: 0,
            blue: 0,
          },
        ),
      ).reduce((acc, count) => acc * count, 1) + acc,
    0,
  );
};

run({
  part1: {
    tests: [
      {
        input: `Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green`,
        expected: 8,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green`,
        expected: 2286,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
