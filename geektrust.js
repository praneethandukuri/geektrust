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

  if (currentBogie !== undefined && currentBogie.distance - hybBogie.distance >= 0) {
    return { stationCode: currentBogie.stationCode, distance: currentBogie.distance - hybBogie.distance };
  }

}

const getBogiesOrder = function (bogies) {
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

  bogies.sort((currentBogie, beforeBogie) => beforeBogie.distance - currentBogie.distance);

  return bogies.map(bogie => bogie.stationCode)
}

const main = function (filename) {
  const trainInput = fs.readFileSync(filename, "utf8")
  const trains = getInitialTrains(trainInput); //[[train_A],[train_B]]
  const trainAB = [];
  const result = [];

  trains.forEach(train => {
    const bogiesOrder = getBogiesOrder(train.slice(2))
    const bogies = bogiesOrder.map(bogie => bogie.stationCode)

    if (bogies.length > 0) {
      result.push(`ARRIVAL ${train[0]} ENGINE ${bogies.join(" ")}`)
    }

    trainAB.push(...bogiesOrder);
  });

  if (result.length <= 0) {
    console.log('JOURNEY_ENDED');
    return
  }

  const trainABBogies = trainAB.filter(bogie => bogie.stationCode !== 'HYB')
  if (trainABBogies.length > 0) {
    const trainABBogiesOrder = getTrainABBogiesOrder(trainABBogies);
    result.push(`DEPARTURE TRAIN_AB ENGINE ENGINE ${trainABBogiesOrder.join(' ')}`);
  }
  console.log(`${result.join('\n')}`);
}

main(process.argv[2]);