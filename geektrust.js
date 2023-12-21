const fs = require("fs")
const { TRAIN_A, TRAIN_B } = require("./sample_input/trains.js")

const getCurrentTrain = function (trainInput) {
  const trains = trainInput.split("\n");
  const trainInputs = trains.map(currentTrain => (currentTrain.trimEnd().split(" ")))

  return trainInputs;
}

const getTrainBogies = function (currentTrain, train) {
  const departedBogies = [];
  const arrivalBogiesOrder = []

  currentTrain.forEach(currentBoghie => {
    if (train[currentBoghie] < train.HYB) {
      departedBogies.push(currentBoghie);
    } else {
      arrivalBogiesOrder.push(currentBoghie);
    }
  });

  return `ARRIVAL ${arrivalBogiesOrder.join(' ')}`;
}

const main = function (filename) {
  const trainInput = fs.readFileSync(filename, "utf8")
  const [trainA, trainB] = getCurrentTrain(trainInput);

  console.log(getTrainBogies(trainA, TRAIN_A));
  console.log(getTrainBogies(trainB, TRAIN_B));
}

main(process.argv[2])