const jsonfile = require('jsonfile');
const moment = require('moment');
const simpleGit = require('simple-git');
const FILE_PATH = './data.json';

// Helper function to generate a random integer between min and max (inclusive)
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const makeCommit = async (n) => {
  if (n === 0) {
    console.log("Pushing changes to the repository...");
    await simpleGit().push();
    return;
  }

  // Generate random values for date adjustment
  const x = getRandomInt(0, 54); // Number of weeks
  const y = getRandomInt(0, 6);  // Number of days

  // Adjust the date
  const DATE = moment()
    .subtract(1, 'y') // Go back one year
    .add(x, 'w')      // Add random weeks
    .add(y, 'd')      // Add random days
    .format();        // Format as ISO string

  // Create data object for writing to the JSON file
  const data = { date: DATE };

  console.log(`Committing with date: ${DATE}`);

  // Write to the JSON file and commit changes
  jsonfile.writeFile(FILE_PATH, data, { spaces: 2 }, async (err) => {
    if (err) {
      console.error('Error writing file:', err);
      return;
    }
    await simpleGit().add(FILE_PATH).commit(`Commit for date: ${DATE}`, { '--date': DATE });
    makeCommit(n - 1); // Recursive call for the next commit
  });
};

// Start the commit process with 500 commits
makeCommit(10);
