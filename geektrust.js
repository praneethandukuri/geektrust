const fs = require("fs");
const { getMergedTrains } = require('./trainOperations');

const TWO = 2;

const main = function (filename) {
  const fileContent = fs.readFileSync(filename, "utf8");
  const result = getMergedTrains(fileContent);
  console.log(result.join('\n'));
}

main(process.argv[TWO]);
