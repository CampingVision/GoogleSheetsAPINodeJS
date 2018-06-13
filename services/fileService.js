const fs            = require('fs');
const config        = require('../config');
const flatten       = require('flat');
const unflatten     = require('flat').unflatten;

// Internal functions
function extractData(jsonObject, columnValid) {
    const data = {};
    // Set the columnValid flag
    for (let property in jsonObject) {
        // Set the columnValid flag
        if (property === 'valid') {
            data[property] = columnValid;
        } else {
            data[property] = jsonObject[property]['value']
        }
    }
    return unflatten(data);
}

const service = {
    read: {
        flatten: (path) => {
            return flatten(JSON.parse(fs.readFileSync(path)));
        },
        async: (path, callback) => {
            fs.readFile(path, callback);
        },
    },
    write: {
        flatten: (path, data) => {
            fs.writeFileSync(path, flatten(data));
        },
        original: (path, data) => {
            fs.writeFileSync(path, data);
        }
    },
    update: {
        file: (jsonObject, column, columnValid) => {
            let file    = config.files.files[column-1];
            const json  = JSON.stringify(extractData(jsonObject, columnValid));
            return new Promise((resolve, reject) => {
                fs.writeFileSync(config.files.path + file, json);
                resolve();
            })
        }
    }
};

module.exports = service;