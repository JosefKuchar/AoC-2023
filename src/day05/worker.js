import { workerData, parentPort } from "worker_threads";

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

// Send result back to parent thread
parentPort.postMessage(min);
