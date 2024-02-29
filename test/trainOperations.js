const fs = require("fs")
const assert = require("assert")
const { describe } = require("mocha");
const { parseInitialTrains, findBogieInTrain, getBogieDistanceFromHyd, getBogiesOrder, sortByDescending, getStationDistances, getMergedBogies, getBogiesArrivingAtHyd, getMergedTrains } = require("../trainOperations");

const TRAINS = JSON.parse(fs.readFileSync("./trainDetails.json", "utf-8"));
const [TRAIN_A, TRAIN_B] = TRAINS;


describe('parseInitialTrain', () => {
  it('should parse and give the trains on each line', () => {
    const input = "TRAIN_A ENGINE NDL NDL KRN GHY SLM NJP NGP BLR \nTRAIN_B ENGINE NJP GHY AGA PNE MAO BPL PTA"
    const expectedOutput = [["TRAIN_A", "ENGINE", "NDL", "NDL", "KRN", "GHY", "SLM", "NJP", "NGP", "BLR"], ["TRAIN_B", "ENGINE", "NJP", "GHY", "AGA", "PNE", "MAO", "BPL", "PTA"]];
    assert.deepStrictEqual(parseInitialTrains(input), expectedOutput);
  })
  it("should trim leading spaces on any line of input", () => {
    const input = "TRAIN_A ENGINE NDL NDL KRN GHY SLM NJP NGP BLR        \r   \nTRAIN_B ENGINE NJP GHY AGA PNE MAO BPL PTA"
    const expectedResult = [["TRAIN_A", "ENGINE", "NDL", "NDL", "KRN", "GHY", "SLM", "NJP", "NGP", "BLR"], ["TRAIN_B", "ENGINE", "NJP", "GHY", "AGA", "PNE", "MAO", "BPL", "PTA"]];
    assert.deepStrictEqual(parseInitialTrains(input), expectedResult)
  })

  it("should give the train bogies when there is only one line of input", () => {
    const input = "TRAIN_A ENGINE NDL NDL KRN GHY SLM NJP NGP BLR        "
    const expectedResult = [["TRAIN_A", "ENGINE", "NDL", "NDL", "KRN", "GHY", "SLM", "NJP", "NGP", "BLR"]];
    assert.deepStrictEqual(parseInitialTrains(input), expectedResult)
  })
}
)

describe('findBogieInTrain', () => {
  const HYB_TO_NDL_DISTANCE = 2700;
  const HYB_TO_GHY_DISTANCE = 4700;
  
  it('should return a bogie in the train', () => {
    assert.deepStrictEqual(findBogieInTrain(TRAIN_A, 'NDL'), { stationCode: 'NDL', distance: HYB_TO_NDL_DISTANCE })
  })
  it('should return a empty object when no specified bogie', () => {
    assert.deepStrictEqual(findBogieInTrain(TRAIN_A, 'AP'), {})
  })
  it('should return a empty object when no specified bogie', () => {
    assert.deepStrictEqual(findBogieInTrain(TRAIN_B, 'GHY'), { stationCode: 'GHY', distance: HYB_TO_GHY_DISTANCE })
  })
})

describe('getBogieDistanceFromHyd', () => {
  const HYB_TO_GHY_DISTANCE = 2700;
  const HYB_TO_NDL_DISTANCE = 1500;

  it('should return a bogie in the train with distance from hyd', () => {
    assert.deepStrictEqual(getBogieDistanceFromHyd('GHY', TRAIN_B), { stationCode: 'GHY', distance: HYB_TO_GHY_DISTANCE });
  })
  it('should return a bogie in the train with distance from hyd', () => {
    assert.deepStrictEqual(getBogieDistanceFromHyd('NDL', TRAIN_A), { stationCode: 'NDL', distance: HYB_TO_NDL_DISTANCE });
  })
  it('should return undefined when specified bogie is not in train', () => {
    assert.deepStrictEqual(getBogieDistanceFromHyd('PNE', TRAIN_B), undefined);
  })
  it('should return undefined when specified bogie is not in train', () => {
    assert.deepStrictEqual(getBogieDistanceFromHyd('KRN', TRAIN_A), undefined);
  })
})

describe("getBogiesOrder", () => {
  const HYB_TO_NDL_DISTANCE = 1500;
  const HYB_TO_GHY_DISTANCE = 2700;
  const HYB_TO_NJP_DISTANCE = 2200;
  const HYB_TO_NGP_DISTANCE = 400;
  const HYB_TO_AGA_DISTANCE = 1300;
  const HYB_TO_BPL_DISTANCE = 800;
  const HYB_TO_PTA_DISTANCE = 1800;

  it("should return bogies order", () => {
    const input = ["NDL", "NDL", "KRN", "GHY", "SLM", "NJP", "NGP", "BLR"];
    const expectedOutput = [{ stationCode: 'NDL', distance: HYB_TO_NDL_DISTANCE }, { stationCode: 'NDL', distance: HYB_TO_NDL_DISTANCE }, { stationCode: 'GHY', distance: HYB_TO_GHY_DISTANCE }, { stationCode: 'NJP', distance: HYB_TO_NJP_DISTANCE }, { stationCode: 'NGP', distance: HYB_TO_NGP_DISTANCE }]
    assert.deepStrictEqual(getBogiesOrder(input), expectedOutput)
  })
  it("should return bogie order", () => {
    const input = ["NJP", "GHY", "AGA", "PNE", "MAO", "BPL", "PTA"];
    const expectedOutput = [{ stationCode: "NJP", distance: HYB_TO_NJP_DISTANCE }, { stationCode: "GHY", distance: HYB_TO_GHY_DISTANCE }, { stationCode: 'AGA', distance: HYB_TO_AGA_DISTANCE }, { stationCode: "BPL", distance: HYB_TO_BPL_DISTANCE }, { stationCode: "PTA", distance: HYB_TO_PTA_DISTANCE }];
    assert.deepStrictEqual(getBogiesOrder(input), expectedOutput);
  })
  it("should return undefined when the 'AP' is not there in train", () => {
    const input = ["AP"];
    const expectedOutput = [];
    assert.deepStrictEqual(getBogiesOrder(input), expectedOutput);
  })
})


describe("sortByDescending", () => {
  const HYB_TO_NDL_DISTANCE = 1500;
  const HYB_TO_GHY_DISTANCE = 2700;
  const HYB_TO_NJP_DISTANCE = 2200;
  const HYB_TO_NGP_DISTANCE = 400;
  const HYB_TO_AGA_DISTANCE = 1300;
  const HYB_TO_BPL_DISTANCE = 800;
  const HYB_TO_PTA_DISTANCE = 1800;

  it('should return the descending order bogies of TRAIN_AB after HYD', () => {
    const input = [{ stationCode: 'NDL', distance: HYB_TO_NDL_DISTANCE }, { stationCode: 'NDL', distance: HYB_TO_NDL_DISTANCE }, { stationCode: 'GHY', distance: HYB_TO_GHY_DISTANCE }, { stationCode: 'NJP', distance: HYB_TO_NJP_DISTANCE }, { stationCode: 'NGP', distance: HYB_TO_NGP_DISTANCE }, { stationCode: 'NJP', distance: HYB_TO_NJP_DISTANCE }, { stationCode: 'GHY', distance: HYB_TO_GHY_DISTANCE }, { stationCode: 'AGA', distance: HYB_TO_AGA_DISTANCE }, { stationCode: 'BPL', distance: HYB_TO_BPL_DISTANCE }, { stationCode: 'PTA', distance: HYB_TO_PTA_DISTANCE }];
    const expectedOutput = ['GHY', 'GHY', 'NJP', 'NJP', 'PTA', 'NDL', 'NDL', 'AGA', 'BPL', 'NGP',];
    assert.deepStrictEqual(sortByDescending(input), expectedOutput);
  })
  it('should return empty array if there is no input given', () => {
    const input = []
    assert.deepStrictEqual(sortByDescending(input), []);
  })
})

describe('getStationDistances', () => {
  const HYB_TO_NDL_DISTANCE = 1500;
  const HYB_TO_GHY_DISTANCE = 2700;
  const HYB_TO_NJP_DISTANCE = 2200;
  const HYB_TO_NGP_DISTANCE = 400;
  const HYB_TO_AGA_DISTANCE = 1300;
  const HYB_TO_BPL_DISTANCE = 800;
  const HYB_TO_PTA_DISTANCE = 1800;

  it('should return station and distances after hyd of both trains', () => {
    const input = [['TRAIN_A', 'ENGINE', 'NDL', 'NDL', 'KRN', 'GHY', 'SLM', 'NJP', 'NGP', 'BLR'], ['TRAIN_B', 'ENGINE', 'NJP', 'GHY', 'AGA', 'PNE', 'MAO', 'BPL', 'PTA']];
    const expectedOutput = [{ stationCode: 'NDL', distance: HYB_TO_NDL_DISTANCE }, { stationCode: 'NDL', distance: HYB_TO_NDL_DISTANCE }, { stationCode: 'GHY', distance: HYB_TO_GHY_DISTANCE }, { stationCode: 'NJP', distance: HYB_TO_NJP_DISTANCE }, { stationCode: 'NGP', distance: HYB_TO_NGP_DISTANCE }, { stationCode: 'NJP', distance: HYB_TO_NJP_DISTANCE }, { stationCode: 'GHY', distance: HYB_TO_GHY_DISTANCE }, { stationCode: 'AGA', distance: HYB_TO_AGA_DISTANCE }, { stationCode: 'BPL', distance: HYB_TO_BPL_DISTANCE }, { stationCode: 'PTA', distance: HYB_TO_PTA_DISTANCE }];
    assert.deepStrictEqual(getStationDistances(input), expectedOutput);
  })
  it('should return station and distances after hyd of trainA', () => {
    const input = [['TRAIN_A', 'ENGINE', 'NDL', 'NDL', 'KRN', 'GHY', 'SLM', 'NJP', 'NGP', 'BLR']];
    const expectedOutput = [{ stationCode: 'NDL', distance: HYB_TO_NDL_DISTANCE }, { stationCode: 'NDL', distance: HYB_TO_NDL_DISTANCE }, { stationCode: 'GHY', distance: HYB_TO_GHY_DISTANCE }, { stationCode: 'NJP', distance: HYB_TO_NJP_DISTANCE }, { stationCode: 'NGP', distance: HYB_TO_NGP_DISTANCE }];
    assert.deepStrictEqual(getStationDistances(input), expectedOutput);
  })
  it('should return empty array if there is no input given', () => {
    const input = [];
    assert.deepStrictEqual(getStationDistances(input), []);
  })
})

describe('getMergedBogies', () => {
  it('it should return string of departure of merged bogies after hyd', () => {
    const input = [['TRAIN_A', 'ENGINE', 'NDL', 'NDL', 'KRN', 'GHY', 'SLM', 'NJP', 'NGP', 'BLR'], ['TRAIN_B', 'ENGINE', 'NJP', 'GHY', 'AGA', 'PNE', 'MAO', 'BPL', 'PTA']];
    const expectedOutput = `DEPARTURE TRAIN_AB ENGINE ENGINE ${['GHY', 'GHY', 'NJP', 'NJP', 'PTA', 'NDL', 'NDL', 'AGA', 'BPL', 'NGP',].join(' ')}`
    assert.deepStrictEqual(getMergedBogies(input), expectedOutput);
  })
  it('it should return empty string when there are no bogies in the train', () => {
    const input = [];
    assert.deepStrictEqual(getMergedBogies(input), '');
  })
  it('it should return empty string when there is no specified bogie in train', () => {
    const input = [['AP']];
    assert.deepStrictEqual(getMergedBogies(input), '');
  })
})

describe('getBogiesArrivingAtHyd', () => {
  it('should return arrival of trainA and trainB of the given input line', () => {
    const input = [['TRAIN_A', 'ENGINE', 'NDL', 'NDL', 'KRN', 'GHY', 'SLM', 'NJP', 'NGP', 'BLR'], ['TRAIN_B', 'ENGINE', 'NJP', 'GHY', 'AGA', 'PNE', 'MAO', 'BPL', 'PTA']];
    const expectedOutput = ['ARRIVAL TRAIN_A ENGINE NDL NDL GHY NJP NGP', 'ARRIVAL TRAIN_B ENGINE NJP GHY AGA BPL PTA'];
    assert.deepStrictEqual(getBogiesArrivingAtHyd(input), expectedOutput)
  })
  it('it should return empty array when there is no bogies in input', () => {
    const input = [];
    assert.deepStrictEqual(getBogiesArrivingAtHyd(input), []);
  })
  it('it should return trainA arrival when there is trainA is given in input', () => {
    const input = [['TRAIN_A', 'ENGINE', 'NDL', 'NDL', 'KRN', 'GHY', 'SLM', 'NJP', 'NGP', 'BLR']];
    assert.deepStrictEqual(getBogiesArrivingAtHyd(input), ['ARRIVAL TRAIN_A ENGINE NDL NDL GHY NJP NGP']);
  })
})

describe('getMergedTrains', () => {
  it('should return arrival of TRAIN_A & TRAIN_B and departure of TRAIN_AB', () => {
    const input = 'TRAIN_A ENGINE NDL NDL KRN GHY SLM NJP NGP BLR\nTRAIN_B ENGINE NJP GHY AGA PNE MAO BPL PTA'
    const expectedOutput = ['ARRIVAL TRAIN_A ENGINE NDL NDL GHY NJP NGP', 'ARRIVAL TRAIN_B ENGINE NJP GHY AGA BPL PTA', `DEPARTURE TRAIN_AB ENGINE ENGINE ${['GHY', 'GHY', 'NJP', 'NJP', 'PTA', 'NDL', 'NDL', 'AGA', 'BPL', 'NGP',].join(' ')}`];
    assert.deepStrictEqual(getMergedTrains(input), expectedOutput);
  })
  it('should return arrival of TRAIN_A & departure of TRAIN_A when only when TRAIN_A given', () => {
    const input = 'TRAIN_A ENGINE NDL NDL KRN GHY SLM NJP NGP BLR'
    const expectedOutput = ['ARRIVAL TRAIN_A ENGINE NDL NDL GHY NJP NGP', `DEPARTURE TRAIN_AB ENGINE ENGINE ${['GHY', 'NJP', 'NDL', 'NDL', 'NGP',].join(' ')}`];
    assert.deepStrictEqual(getMergedTrains(input), expectedOutput);
  })
  it('should return JOURNEY _ENDED when there is no input', () => {
    const input = ''
    const expectedOutput = ['JOURNEY_ENDED'];
    assert.deepStrictEqual(getMergedTrains(input), expectedOutput);
  })
  it('should return JOURNEY _ENDED when there is no bogies after reaching HYD', () => {
    const input = 'TRAIN_A ENGINE KRN SLM BLR\nTRAIN_B ENGINE PNE MAO'
    const expectedOutput = ['JOURNEY_ENDED'];
    assert.deepStrictEqual(getMergedTrains(input), expectedOutput);
  })
})