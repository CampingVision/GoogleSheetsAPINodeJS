const {google}      = require('googleapis');
const config        = require('./config');
const authService   = require('./services/authService');
const fileService   = require('./services/fileService');
const jsonService   = require('./services/jsonService');
const googleService = require('./services/googleService');

module.exports = {
    read: function (values) {
        // Load client secrets from a local file.
        fileService.read.async('client_secret.json', (err, data) => {
            if (err) return console.log('Error loading client secret file:', err);
            // Authorize a client with credentials, then call the Google Sheets API.
            authService.auth(JSON.parse(data), values, retrieveData);
        });
    },
    update: function (values) {
        // Load client secrets from a local file.
        fileService.read.async('client_secret.json', (err, data) => {
            if (err) return console.log('Error loading client secret file:', err);
            // Authorize a client with credentials, then call the Google Sheets API.
            authService.auth(JSON.parse(data), values, checkForAddittions);
        });
    }
};

function retrieveData(auth, values) {
    let count       = 0;
    const sheets    = google.sheets({version: 'v4', auth});
    const ranges    = googleService.calculateRanges(values);

    sheets.spreadsheets.values.batchGet({
        spreadsheetId: config.sheet.id,
        ranges: ranges,
    }, (err, {data}) => {
        if (err) return console.log('The API returned an error: ' + err);
        for (let i = 1; i < values.length; i++) {
            // Define pairs from column 0 as key and column i as value
            const jsonObject = jsonService.createJsonObject(data.valueRanges[0].values, data.valueRanges[i].values);
            googleService.updateColorsTitle(auth, i, jsonObject['valid']).then(() => {
                googleService.updateColorsBody(auth, jsonObject, i).then(() => {
                    // Update files
                    fileService.update.file(jsonObject, i, jsonObject['valid']).then(() => {
                        count++;
                        // If last file then close program
                        if(count === values.length-1) {
                            console.log('Done');
                            process.exit();
                        }
                    });
                });
            });
        }
    })
}

function checkForAddittions(auth, values) {
    // Load files from config
    let flattenFiles            = [];
    const files                 = config.files.files;
    const defaultFile           = config.files.default;
    const defaultFileFlatten    = fileService.read.flatten(config.files.path + defaultFile);

    // Load flattened files
    files.forEach((file) => {
        flattenFiles.push(fileService.read.flatten(config.files.path + file));
    });

    // Update attributes
    let objects                 = [];
    const ranges                = googleService.calculateRanges(values);
    const attributes            = jsonService.getAttributes(defaultFileFlatten);
    const originalAttributes    = jsonService.getAttributes(flattenFiles[1]); // Make sure that index 1 is not default file
    const attLength             = attributes.length;
    const orgLength             = originalAttributes.length;
    // Attribute data
    const range                 = 'Translations!A2:A' + (attLength + 1);
    const attData = {
        range: range, values: attributes
    };

    googleService.updateColunmsData(auth, attData).then(() => {
        console.log('Attributes updated');

        // Update all objects
        flattenFiles.forEach((flattenFile) => {
            objects.push(jsonService.updateJsonObjectAttributes(defaultFileFlatten, flattenFile));
        });

        for(let i = 1; i < values.length; i++) {
            googleService.updateColorsTitle(auth, i, objects[i-1]['valid']).then(() => {
                googleService.updateColorsBody(auth, objects[i-1], i).then(() => {
                    const array = jsonService.extractValues(defaultFileFlatten, objects[i-1]);
                    const columnData = [
                        {range: ranges[i], values: array}
                    ];
                    googleService.updateColunmsData(auth, columnData).then(() => {
                        // When done with all the updates then update attributes colors and remove unused rows
                        if (i === values.length-1) {
                            // If attributes was removed then delete unused rows
                            if(attLength < orgLength) {
                                googleService.deleteUnusedRows(auth, attLength+1, orgLength+1).then(() => {
                                    console.log('Rows removed.');
                                    retrieveData(auth, values);
                                });
                            } else if (attLength > orgLength) {
                                // Update attribute column colors
                                googleService.updateColorsAttributes(auth, orgLength+1, attLength+1).then(() => {
                                    console.log('Attributes colors updated');
                                    retrieveData(auth, values);
                                });
                            } else {
                                console.log('Updating files...');
                                retrieveData(auth, values);
                            }
                        }
                    });
                });
            });
        }
    });
}
