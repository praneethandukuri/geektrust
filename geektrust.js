const fs = require("fs");
const { getMergedTrains } = require('./trainOperations');

const main = function (filename) {
  const fileContent = fs.readFileSync(filename, "utf8");
  const result = getMergedTrains(fileContent);
  console.log(result.join('\n'));
}

main(process.argv[2]);
