const {google}      = require('googleapis');
const colors        = require('../utils/colors');
const config        = require('../config');
const fileService   = require('../services/fileService');

const service = {
    updateColorsAttributes: (auth, startRow, endRow) => {
        const sheets = google.sheets({version: 'v4', auth});
        const requests = [];
        // Run through the jsonObject and update colors based on validity start from row 1
        requests.push({
            repeatCell: {
                range: {
                    sheetId: 0,
                    startRowIndex: startRow,
                    endRowIndex: endRow,
                    startColumnIndex: 0,
                    endColumnIndex: 1,
                },
                cell: {
                    userEnteredFormat: {
                        // Check if text value is valid and set color accordingly
                        backgroundColor: colors.bluebody
                    }
                },
                fields: "userEnteredFormat(backgroundColor)"
            }
        });

        const batchUpdateRequest = {requests: requests};

        return new Promise((resolve, reject) => {
            sheets.spreadsheets.batchUpdate({
                spreadsheetId: config.sheet.id,
                resource: batchUpdateRequest
            }, (err, {data}) => {
                if (err) reject('The API returned an error: ' + err);
                resolve('Done with attributes');
            });
        });
    },
    updateColorsBody: (auth, jsonObj, column) => {
        const sheets = google.sheets({version: 'v4', auth});
        const requests = [];
        // Run through the jsonObject and update colors based on validity start from row 1
        let index = 1;
        for (let property in jsonObj) {
            // Skip the valid property of the json object
            if(property === 'valid') continue;
            const value = jsonObj[property];
            // add change color request.
            requests.push({
                repeatCell: {
                    range: {
                        sheetId: 0,
                        startRowIndex: index,
                        endRowIndex: index+1,
                        startColumnIndex: column,
                        endColumnIndex: column+1,
                    },
                    cell: {
                        userEnteredFormat: {
                            // Check if text value is valid and set color accordingly
                            backgroundColor: value['valid'] ? colors.greenBody : colors.redBody
                        }
                    },
                    fields: "userEnteredFormat(backgroundColor)"
                }
            });
            index++;
        }

        const batchUpdateRequest = {requests: requests};

        return new Promise((resolve, reject) => {
            sheets.spreadsheets.batchUpdate({
                spreadsheetId: config.sheet.id,
                resource: batchUpdateRequest
            }, (err, {data}) => {
                if (err) reject('The API returned an error: ' + err);
                resolve('Done with body for column: ' + column);
            });
        });
    },
    updateColorsTitle: (auth, column, columnValid) => {
        const sheets = google.sheets({version: 'v4', auth});
        const requests = [];
        requests.push({
            repeatCell: {
                range: {
                    sheetId: 0,
                    startRowIndex: 0,
                    endRowIndex: 1,
                    startColumnIndex: column,
                    endColumnIndex: column+1,
                },
                cell: {
                    userEnteredFormat: {
                        // Check if text value is valid and set color accordingly
                        backgroundColor: columnValid ? colors.greenTitle : colors.redTitle
                    }
                },
                fields: "userEnteredFormat(backgroundColor)"
            }
        });

        const batchUpdateRequest = {requests: requests};

        return new Promise((resolve, reject) => {
            sheets.spreadsheets.batchUpdate({
                spreadsheetId: config.sheet.id,
                resource: batchUpdateRequest
            }, (err, {data}) => {
                if (err) reject('The API returned an error: ' + err);
                resolve('Done with title for column: ' + column);
            });
        });
    },
    updateColunmsData: (auth, columnData) => {
        const sheets = google.sheets({version: 'v4', auth});

        // Define request object
        const request = {
            data: columnData,
            valueInputOption: 'RAW'
        };
        return new Promise((resolve, reject) => {
            sheets.spreadsheets.values.batchUpdate({
                spreadsheetId: config.sheet.id,
                resource: request
            }, function(err, result) {
                if(err) reject(err);
                resolve('%d cells updated.', result.totalUpdatedCells);
            });
        })
    },
    deleteUnusedRows: (auth, startRow, endRow) => {
        const sheets = google.sheets({version: 'v4', auth});
        const requests = [];
        // Run through the jsonObject and update colors based on validity start from row 1
        requests.push({
            deleteRange: {
                range: {
                    sheetId: 0,
                    startRowIndex: startRow,
                    endRowIndex: endRow,
                    startColumnIndex: 0,
                    endColumnIndex: 8,
                },
                shiftDimension: 'ROWS'
            }
        });

        const batchUpdateRequest = {requests: requests};

        return new Promise((resolve, reject) => {
            sheets.spreadsheets.batchUpdate({
                spreadsheetId: config.sheet.id,
                resource: batchUpdateRequest
            }, (err, {data}) => {
                if (err) reject('The API returned an error: ' + err);
                resolve('Rows deleted');
            });
        });
    },
    calculateRanges: (values) => {
        let file = fileService.read.flatten('./files/en.json');
        const length = Object.keys(file).length;
        const ranges = [];
        for (let i = 0; i < values.length; i++) {
            ranges.push('Translations!' + values[i] + '2:' + values[i] + (length+1))
        }
        return ranges;
    }
};

module.exports = service;