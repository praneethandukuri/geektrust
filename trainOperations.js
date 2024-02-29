const fs = require("fs")

const TRAINS = JSON.parse(fs.readFileSync("./trainDetails.json", "utf-8"));
const [TRAIN_A, TRAIN_B] = TRAINS;

const ZERO = 0;
const TWO = 2;

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
  if (currentBogie.distance - hybBogie.distance >= ZERO) {
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
    const bogiesOrder = getBogiesOrder(train.slice(TWO));
    stationDistances.push(...bogiesOrder);
  });
  return stationDistances;
}

const getMergedBogies = function (initialBogieOrder) {
  const trainAB = getStationDistances(initialBogieOrder);
  const trainABBogies = trainAB.filter(bogie => bogie.stationCode !== 'HYB');
  if (trainABBogies.length <= ZERO) {
    return "";
  }
  const trainABBogiesOrder = sortByDescending(trainABBogies);
  return `DEPARTURE TRAIN_AB ENGINE ENGINE ${trainABBogiesOrder.join(' ')}`;
}

const getBogiesArrivingAtHyd = function (trains) {
  const trainsArrivingAtHyd = [];
  trains.forEach(train => {
    const bogiesOrder = getBogiesOrder(train.slice(TWO));
    const bogies = bogiesOrder.map(bogie => bogie.stationCode);

    if (bogies.length > ZERO) {
      trainsArrivingAtHyd.push(`ARRIVAL ${train[ZERO]} ENGINE ${bogies.join(" ")}`);
    }
  });
  return trainsArrivingAtHyd
}

const getMergedTrains = function (trainInput) {
  const initialBogieOrder = parseInitialTrains(trainInput);
  const remainingBogies = getBogiesArrivingAtHyd(initialBogieOrder);
  if (remainingBogies.length <= ZERO) {
    return ['JOURNEY_ENDED'];
  }

  const mergedBogies = getMergedBogies(initialBogieOrder);

  return [...remainingBogies, mergedBogies];
}

module.exports = { parseInitialTrains, findBogieInTrain, getMergedTrains, getBogieDistanceFromHyd, getBogiesOrder, sortByDescending, getStationDistances, getMergedBogies, getBogiesArrivingAtHyd, getMergedTrains };