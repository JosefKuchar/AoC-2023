import { workerData } from "worker_threads";

console.log("running", workerData.start, workerData.length);
let min = Number.MAX_SAFE_INTEGER;
for (let j = workerData.start; j < workerData.start + workerData.length; j++) {
  let currentId = j;
  workerData.maps.forEach((map) => {
    for (const [dest, source, length] of map) {
      if (currentId >= source && currentId < source + length) {
        currentId = dest + (currentId - source);
        break;
      }
    }
  });
  if (currentId < min) {
    min = currentId;
  }
}
workerData.results.push(min);
console.log("min", min);
