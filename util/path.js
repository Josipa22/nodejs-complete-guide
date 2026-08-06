const path = require('path');

// returns the directory name of the current module file
// this gives us the absolute path to the root folder of our project
module.exports = path.dirname(process.mainModule.filename);
