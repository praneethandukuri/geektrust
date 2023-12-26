// const trainBogies = []; // [{ stationCode: 'NDL', distance: 2700 },{ stationCode: 'NDL', distance: 2700 },{ stationCode: 'GHY', distance: 4700 },{ stationCode: 'NGP', distance: 2400 },{ stationCode: 'NJP', distance: 4200 }]
const fs = require("fs")
const { TRAINS } = require("./sample_input/trains.js")

const [TRAIN_A, TRAIN_B] = TRAINS

const getInitialTrains = function (trainInput) {
  const trains = trainInput.split("\n");
  const trainInputs = trains.map(currentTrain => (currentTrain.trimEnd().split(" ")))

  return trainInputs;
}

const getBogieFromTrain = function (train, bogie) {
  return train.find(station => station.stationCode === bogie)
}

const getUndepartedBogies = function (bogie, train) {

  const hybBogie = getBogieFromTrain(train, "HYB")
  const currentBogie = getBogieFromTrain(train, bogie)
  if (currentBogie !== undefined && currentBogie.distance - hybBogie.distance > 0) {
    return { stationCode: currentBogie.stationCode, distance: currentBogie.distance - hybBogie.distance };
  }

}

const getBogiesOrder = function (bogies) {// ['NDL','NDL','KRN','GHY','SLM','NGP','BLR']
  const remainingBogies = [];

  bogies.forEach(bogie => {
    if (getUndepartedBogies(bogie, TRAIN_A) !== undefined) {
      remainingBogies.push(getUndepartedBogies(bogie, TRAIN_A))
    } else if (getUndepartedBogies(bogie, TRAIN_B) !== undefined) {
      remainingBogies.push(getUndepartedBogies(bogie, TRAIN_B))
    }
  })

  return remainingBogies;
}

const getTrainABBogiesOrder = function (bogies) {
  const trainABBogiesOrder = [];
  const distances = []
  for (let index = 0; index < bogies.length; index++) {
    if (TRAIN_A[bogies[index]]) {
      distances.push({ [bogies[index]]: TRAIN_A[bogies[index]] - TRAIN_A.HYB })

    } else {
      distances.push({ [bogies[index]]: TRAIN_B[bogies[index]] - TRAIN_B.HYB })

    }
  }
  trainABBogiesOrder.sort((currentBogie, beforeBogie) => currentBogie - beforeBogie);

  return trainABBogiesOrder;
}

const getTrainABBogies = function (trains) {
  const trainABBogies = (trains.join(" ").split(" "));
  return getTrainABBogiesOrder(trainABBogies);
}

const main = function (filename) {
  const trainInput = fs.readFileSync(filename, "utf8")
  const trains = getInitialTrains(trainInput); //[[train_A],[train_B]]
  const trainAB = [];

  trains.forEach(train => {
    const bogiesOrder = getBogiesOrder(train.slice(2))
    const bogies = bogiesOrder.map(bogie => bogie.stationCode)
    console.log(`ARRIVAL ${train[0]} ENGINE ${bogies.join(" ")}`);
    trainAB.push(bogiesOrder);
  });

  getTrainABBogies(trainAB);
}

main(process.argv[2]);