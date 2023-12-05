import run from "aocrunner";
import { Worker } from "worker_threads";

const parseInput = (rawInput: string) => {
  const [rawSeeds, ...rawMaps] = rawInput.trim().split("\n\n");

  return {
    seeds: rawSeeds.split(": ")[1].split(" ").map(Number),
    maps: rawMaps.map((rawMap) =>
      rawMap
        .split("\n")
        .filter((_, i) => i !== 0)
        .map((rawRow) => rawRow.split(" ").map(Number)),
    ),
  };
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return input.seeds.reduce((acc, seed) => {
    let currentId = seed;
    input.maps.forEach((map) => {
      for (const [dest, source, length] of map) {
        if (currentId >= source && currentId < source + length) {
          currentId = dest + (currentId - source);
          break;
        }
      }
    });
    return currentId < acc ? currentId : acc;
  }, Number.MAX_SAFE_INTEGER);
};

const part2 = async (rawInput: string) => {
  const input = parseInput(rawInput);
  const workers: Promise<Worker>[] = [];
  const results: any = [];
  for (let i = 0; i < input.seeds.length; i += 2) {
    const worker = new Worker("./src/day05/worker.js", {
      workerData: {
        start: input.seeds[i],
        length: input.seeds[i + 1],
        maps: input.maps,
        results,
      },
    });
    workers.push(new Promise((res) => worker.once("exit", res)));
  }
  await Promise.all(workers);

  console.log(results);

  return Math.min(...results);
};

run({
  part1: {
    tests: [
      {
        input: `seeds: 79 14 55 13

seed-to-soil map:
50 98 2
52 50 48

soil-to-fertilizer map:
0 15 37
37 52 2
39 0 15

fertilizer-to-water map:
49 53 8
0 11 42
42 0 7
57 7 4

water-to-light map:
88 18 7
18 25 70

light-to-temperature map:
45 77 23
81 45 19
68 64 13

temperature-to-humidity map:
0 69 1
1 0 69

humidity-to-location map:
60 56 37
56 93 4`,
        expected: 35,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `seeds: 79 14 55 13

seed-to-soil map:
50 98 2
52 50 48

soil-to-fertilizer map:
0 15 37
37 52 2
39 0 15

fertilizer-to-water map:
49 53 8
0 11 42
42 0 7
57 7 4

water-to-light map:
88 18 7
18 25 70

light-to-temperature map:
45 77 23
81 45 19
68 64 13

temperature-to-humidity map:
0 69 1
1 0 69

humidity-to-location map:
60 56 37
56 93 4`,
        expected: 46,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: true,
});
