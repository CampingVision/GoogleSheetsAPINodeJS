const fs = require('fs');
const config = require('./config');
const languagePack = require('./languages');
const authService = require('./services/authService')
const googleService = require('./services/googleService');

// Load client secrets from a local file.
fs.readFile('client_secret.json', (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);

    // Authorize a client with credentials, then call the Google Sheets API.
    authService.auth(JSON.parse(content), null, setup);
});

/**
 * Setup the Google sheet data.
 *
 * @param auth
 */
function setup(auth) {
    const files = config.files.files;
    const columnData = generateColumnData(files);
    googleService.updateColunmsData(auth, columnData).then(() => {
        console.log('Sheet data applied');
        process.exit();
    }).catch((err) => {
        console.log(err);
        process.exit();
    });
}

/**
 * Generate the column data based on the config file data.
 *
 * @param files
 * @returns {*[]}
 */
function generateColumnData(files) {
    const ranges = defineRanges();
    let rangeIndex = 1;
    let columnData = [
        {range: ranges[0], values: [['Fields']]}
    ];
    files.forEach((file) => {
        const ISO = file.split('.')[0];
        columnData.push({range: ranges[rangeIndex], values:[[languagePack[ISO]]]});
        rangeIndex++;
    });
    return columnData;
}

/**
 * Define ranges based on the columns from the config file.
 *
 * @returns {Array}
 */
function defineRanges() {
    const columns = config.sheet.columns;
    let ranges = [];
    columns.forEach((column) => {
        ranges.push(config.sheet.sheetName + '!' + column + '1:1')
    });
    return ranges;
}