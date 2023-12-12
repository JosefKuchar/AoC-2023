import { workerData, parentPort } from "worker_threads";

const checkRow = (row, groups, length) => {
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

const calculateCombinations = (current, original, groups) => {
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

let sum = 0;
workerData.data.forEach((row) => {
  let newState = row.state;
  let newGroups = row.groups;
  for (let i = 0; i < 4; i++) {
    newState += "?" + row.state;
    newGroups = [...newGroups, ...row.groups];
  }
  console.log(newState);
  sum += calculateCombinations("", newState, newGroups);
});

// Send result back to parent thread
parentPort.postMessage(sum);
