const fs = require("fs");
const { getInitialTrains, getBogiesOrder, getTrainABBogiesOrder } = require('./trainOperations');

const main = function (filename) {
  const trainInput = fs.readFileSync(filename, "utf8");
  const trains = getInitialTrains(trainInput);
  const trainAB = [];
  const result = [];

  trains.forEach(train => {
    const bogiesOrder = getBogiesOrder(train.slice(2));
    const bogies = bogiesOrder.map(bogie => bogie.stationCode);

    if (bogies.length > 0) {
      result.push(`ARRIVAL ${train[0]} ENGINE ${bogies.join(" ")}`);
    }

    trainAB.push(...bogiesOrder);
  });

  if (result.length <= 0) {
    console.log('JOURNEY_ENDED');
    return;
  }

  const trainABBogies = trainAB.filter(bogie => bogie.stationCode !== 'HYB');
  if (trainABBogies.length > 0) {
    const trainABBogiesOrder = getTrainABBogiesOrder(trainABBogies);
    result.push(`DEPARTURE TRAIN_AB ENGINE ENGINE ${trainABBogiesOrder.join(' ')}`);
  }
  console.log(`${result.join('\n')}`);
}

main(process.argv[2]);
