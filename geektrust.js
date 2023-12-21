const fs = require("fs")
const { TRAIN_A, TRAIN_B } = require("./sample_input/trains.js")

const getInitialTrains = function (trainInput) {
  const trains = trainInput.split("\n");
  const trainInputs = trains.map(currentTrain => (currentTrain.trimEnd().split(" ")))

  return trainInputs;
}

const getBogiesOrder = function (currentTrain) {
  const arrivalBogiesOrder = currentTrain.filter(currentBoghie => {
    return TRAIN_A[currentBoghie] > TRAIN_A.HYB || TRAIN_B[currentBoghie] > TRAIN_B.HYB
  });

  return arrivalBogiesOrder.join(' ')
}

const main = function (filename) {
  const trainInput = fs.readFileSync(filename, "utf8")
  const trains = getInitialTrains(trainInput);

  trains.forEach(train => {
    const bogiesOrder = getBogiesOrder(train)
    console.log(`ARRIVAL ${train[0]} ENGINE ${bogiesOrder}`);
  });
}

main(process.argv[2])