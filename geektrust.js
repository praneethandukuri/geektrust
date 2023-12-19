const fs = require("fs")
const { TRAIN_A, TRAIN_B } = require("./sample_input/trains.js")

const filename = process.argv[2]

const trainInput = fs.readFileSync(filename, "utf8")

const trainA = (trainInput.split("\n")[0].trimEnd().split(" "));
const removedBhogisInTrainA = []
const remainingBhogisInTrainA = []
trainA.forEach(currentBoghie => {
  if (TRAIN_A[currentBoghie] < TRAIN_A.HYB) {
    removedBhogisInTrainA.push(currentBoghie);
  } else {
    remainingBhogisInTrainA.push(currentBoghie);
  }
});
console.log(`ARRIVAL ${remainingBhogisInTrainA.join(' ')}`);
// console.log(`ARRIVAL ${removedBhogisInTrainA.join(' ')}`);

const trainB = (trainInput.split("\n")[1].trimEnd().split(" "));
const removedBhogisInTrainB = []
const remainingBhogisInTrainB = []
trainB.forEach(currentBoghie => {
  if (TRAIN_B[currentBoghie] < TRAIN_B.HYB) {
    removedBhogisInTrainB.push(currentBoghie);
  } else {
    remainingBhogisInTrainB.push(currentBoghie);
  }
});
console.log(`ARRIVAL ${remainingBhogisInTrainB.join(' ')}`);


const functionName = function (params) {
  return;
}
functionName()
