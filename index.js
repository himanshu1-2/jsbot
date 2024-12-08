const jsonfile = require('jsonfile');
const moment = require('moment');
const simpleGit = require('simple-git');
const random = require('random');

// Helper function to generate a random integer between min and max (inclusive)
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const FILE_PATH = './data.json';

const makeCommit = async(n) => {
  if (n === 0) {
    console.log("Pushing changes to the remote repository...");
    await simpleGit().push('origin', 'main');
    return;
  }

  // Generate random weeks and days
  const x = getRandomInt(0, 54); // Number of weeks
  const y = getRandomInt(0, 6);  // Number of days

  // Adjust the date
  const DATE = moment()
    .subtract(1, 'y') // Go back one year
    .add(1, 'd')      // Add one day to avoid today
    .add(x, 'w')      // Add random weeks
    .add(y, 'd')      // Add random days
    .format();

  const data = { date: DATE };

  console.log(`Committing for date: ${DATE}`);

  // Write the date to the JSON file and commit
  jsonfile.writeFile(FILE_PATH, data, { spaces: 2 }, (err) => {
    if (err) {
      console.error('Error writing file:', err);
      return;
    }

    simpleGit()
      .add(FILE_PATH)
      .commit(`Commit for date: ${DATE}`, { '--date': DATE })
      .then(() => {
        // Recursive call after the current commit completes
        makeCommit(n - 1);
      })
      .catch((commitErr) => {
        console.error('Error committing:', commitErr);
      });
  });
};

// Start the commit process with 100 commits
makeCommit(10);
