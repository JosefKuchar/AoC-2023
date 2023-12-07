import run from "aocrunner";

type Input = {
  cards: number[];
  org: number[];
  bid: number;
}[];

const parseInput = (rawInput: string) =>
  rawInput
    .trim()
    .split("\n")
    .map((line) => {
      const [cardsRaw, bidRaw] = line.split(" ");
      const cards = cardsRaw.split("").map((card) => {
        switch (card) {
          case "T":
            return 10;
          case "J":
            return 11;
          case "Q":
            return 12;
          case "K":
            return 13;
          case "A":
            return 14;
          default:
            return Number(card);
        }
      });
      return {
        cards,
        org: cards,
        bid: Number(bidRaw),
      };
    });

const getStrength = (cards: number[]) => {
  let counts: { [key: number]: number } = {};
  cards.forEach((card) => {
    counts[card] = counts[card] ? counts[card] + 1 : 1;
  });
  const c = Object.values(counts);
  if (c.includes(5)) {
    return 7;
  }
  if (c.includes(4)) {
    return 6;
  }
  if (c.includes(3) && c.includes(2)) {
    return 5;
  }
  if (c.includes(3)) {
    return 4;
  }
  if (c.filter((count) => count === 2).length === 2) {
    return 3;
  }
  if (c.includes(2)) {
    return 2;
  }
  return 1;
};

const sortCards = (
  { cards: cards1, org: org1 }: { cards: number[]; org: number[] },
  { cards: cards2, org: org2 }: { cards: number[]; org: number[] },
) => {
  const strength1 = getStrength(cards1);
  const strength2 = getStrength(cards2);
  if (strength1 < strength2) {
    return -1;
  } else if (strength1 > strength2) {
    return 1;
  }
  for (let i = 0; i < org1.length; i++) {
    if (org1[i] < org2[i]) {
      return -1;
    } else if (org1[i] > org2[i]) {
      return 1;
    }
  }
  return 0;
};

const solve = (input: Input) => {
  const sorted = input.sort(sortCards);
  return sorted.reduce((acc, { bid }, i) => acc + bid * (i + 1), 0);
};

const part1 = (rawInput: string) => solve(parseInput(rawInput));

const generateCombinations = (
  cards: number[],
  index: number,
  generated: number[],
) => {
  if (index === cards.length) {
    return [generated];
  }
  const card = cards[index];
  const result: number[][] = [];
  if (card === 11) {
    for (let a = 2; a <= 14; a++) {
      result.push(...generateCombinations(cards, index + 1, [...generated, a]));
    }
  } else {
    result.push(
      ...generateCombinations(cards, index + 1, [...generated, card]),
    );
  }
  return result;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  return solve(
    input.map(({ cards, bid }) => {
      const combinations = generateCombinations(cards, 0, [])
        .map((generated) => ({ cards: generated, org: cards }))
        .sort(sortCards);
      const best = combinations[combinations.length - 1].cards;
      return { cards: best, org: cards.map((c) => (c === 11 ? 0 : c)), bid };
    }),
  );
};

run({
  part1: {
    tests: [
      {
        input: `32T3K 765
T55J5 684
KK677 28
KTJJT 220
QQQJA 483`,
        expected: 6440,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `32T3K 765
T55J5 684
KK677 28
KTJJT 220
QQQJA 483`,
        expected: 5905,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
