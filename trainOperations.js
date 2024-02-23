const { TRAINS } = require("./trainDetails.js");

const [TRAIN_A, TRAIN_B] = TRAINS;

const getInitialTrains = function (trainInput) {
  const trains = trainInput.split("\n");
  const trainInputs = trains.map(currentTrain => (currentTrain.trimEnd().split(" ")));
  return trainInputs;
}

const getBogieFromTrain = function (train, bogie) {
  return train.find(station => station.stationCode === bogie);
}

const getUndepartedBogies = function (bogie, train) {
  const hybBogie = getBogieFromTrain(train, "HYB");
  const currentBogie = getBogieFromTrain(train, bogie);

  if (currentBogie !== undefined && currentBogie.distance - hybBogie.distance >= 0) {
    return { stationCode: currentBogie.stationCode, distance: currentBogie.distance - hybBogie.distance };
  }

}

const getBogiesOrder = function (bogies) {
  const bogiesOrder = [];

  bogies.forEach(bogie => {
    if (getUndepartedBogies(bogie, TRAIN_A) !== undefined) {
      bogiesOrder.push(getUndepartedBogies(bogie, TRAIN_A));
    } else if (getUndepartedBogies(bogie, TRAIN_B) !== undefined) {
      bogiesOrder.push(getUndepartedBogies(bogie, TRAIN_B));
    }
  })

  return bogiesOrder;
}

const getTrainABBogiesOrder = function (bogies) {

  bogies.sort((currentBogie, beforeBogie) => beforeBogie.distance - currentBogie.distance);

  return bogies.map(bogie => bogie.stationCode);
}

module.exports = { getInitialTrains, getBogiesOrder, getTrainABBogiesOrder };