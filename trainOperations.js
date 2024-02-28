const { TRAINS } = require("./trainDetails.js");

const [TRAIN_A, TRAIN_B] = TRAINS;

const parseInitialTrains = function (trainInput) {
  const trains = trainInput.split("\n");
  const trainInputs = trains.map(currentTrain => (currentTrain.trimEnd().split(" ")));
  return trainInputs;
}

const findBogieInTrain = function (train, bogie) {
  return train.find(station => station.stationCode === bogie) || {};
}

const getBogieDistanceFromHyd = function (bogie, train) {
  const hybBogie = findBogieInTrain(train, "HYB");
  const currentBogie = findBogieInTrain(train, bogie);
  if (currentBogie.distance - hybBogie.distance >= 0) {
    return { stationCode: currentBogie.stationCode, distance: currentBogie.distance - hybBogie.distance };
  }
}

const getBogiesOrder = function (bogies) {
  const bogiesOrder = bogies
    .map(bogie => getBogieDistanceFromHyd(bogie, TRAIN_A) || getBogieDistanceFromHyd(bogie, TRAIN_B))
    .filter(value => value !== undefined);
  return bogiesOrder;
};

const sortByDescending = function (bogies) {
  bogies.sort((currentBogie, previousBogie) => previousBogie.distance - currentBogie.distance);
  return bogies.map(bogie => bogie.stationCode);
}

const getStationDistances = function (trains) {
  const stationDistances = [];
  trains.forEach(train => {
    const bogiesOrder = getBogiesOrder(train.slice(2));
    stationDistances.push(...bogiesOrder);
  });
  return stationDistances;
}

const getMergedBogies = function (initialBogieOrder) {
  const trainAB = getStationDistances(initialBogieOrder);
  const trainABBogies = trainAB.filter(bogie => bogie.stationCode !== 'HYB');
  if (trainABBogies.length <= 0) {
    return "";
  }
  const trainABBogiesOrder = sortByDescending(trainABBogies);
  return `DEPARTURE TRAIN_AB ENGINE ENGINE ${trainABBogiesOrder.join(' ')}`;
}

const getBogiesArrivingAtHyd = function (trains) {
  const trainsArrivingAtHyd = [];
  trains.forEach(train => {
    const bogiesOrder = getBogiesOrder(train.slice(2));
    const bogies = bogiesOrder.map(bogie => bogie.stationCode);

    if (bogies.length > 0) {
      trainsArrivingAtHyd.push(`ARRIVAL ${train[0]} ENGINE ${bogies.join(" ")}`);
    }
  });
  return trainsArrivingAtHyd
}

const getMergedTrains = function (trainInput) {
  const initialBogieOrder = parseInitialTrains(trainInput);
  const remainingBogies = getBogiesArrivingAtHyd(initialBogieOrder);
  if (remainingBogies.length <= 0) {
    return ['JOURNEY_ENDED'];
  }

  const mergedBogies = getMergedBogies(initialBogieOrder);

  return [...remainingBogies, mergedBogies];
}

module.exports = { parseInitialTrains, findBogieInTrain, getMergedTrains, TRAIN_A, TRAIN_B, getBogieDistanceFromHyd, getBogiesOrder, sortByDescending, getStationDistances, getMergedBogies, getBogiesArrivingAtHyd, getMergedTrains };