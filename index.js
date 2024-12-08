const jsonfile = require('jsonfile');
const moment = require('moment');
const simpleGit = require('simple-git');
const FILE_PATH = './data.json';

// Helper function to generate a random integer between min and max (inclusive)
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const makeCommit = async (n) => {
  if (n === 0) {
    console.log("Pushing changes to the remote repository...");
    await simpleGit().push('origin', 'main'); // Explicitly push to the remote 'origin' and branch 'main'
    console.log("Push complete.");
    return;
  }

  const x = getRandomInt(0, 54); // Random weeks
  const y = getRandomInt(0, 6);  // Random days

  const DATE = moment()
    .subtract(1, 'y')
    .add(x, 'w')
    .add(y, 'd')
    .format();

  const data = { date: DATE };

  console.log(`Creating commit for date: ${DATE}`);

  jsonfile.writeFile(FILE_PATH, data, { spaces: 2 }, async (err) => {
    if (err) {
      console.error('Error writing file:', err);
      return;
    }

    await simpleGit().add(FILE_PATH).commit(`Commit for date: ${DATE}`, { '--date': DATE });
    makeCommit(n - 1);
  });
};

// Start the commit process
makeCommit(20);
