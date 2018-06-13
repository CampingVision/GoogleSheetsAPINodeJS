// Define config file and variables
const config = {
    basePath: __dirname,
    sheet: {
        // The id is the value found in the url https://docs.google.com/spreadsheets/d/<SHEET ID>/edit#gid=0
        id: '<SHEET ID>',
        // The sheet name which can be seen in the tab at the bottom of the google sheet
        sheetName: 'Translations',
        // Sheet id is the zero index of the sheet tabs
        sheetId: 0,
        // Set the default value for the empty cells
        reserved: '-/-',
        // Defined all the columns from the google sheet, column a should be the json attributes
        columns: []
    },
    files: {
        // Set the file path here
        path: __dirname + '\\files\\',
        // Define default encoding
        encoding: 'uft-8',
        // Defined default language file
        default: '',
        // Make sure that the languages matches up to the columns and the first language is the default
        files: []
    },
};

module.exports = config;