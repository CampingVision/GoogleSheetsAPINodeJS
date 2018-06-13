const config = require('../config');

// Internal function
function validateValues(val) {
    return (val !== config.sheet.reserved && val !== '' && val !== undefined);
}

const service = {
    createJsonObject: (keys, values) => {
        // Initialize jsonObject
        const jsonObj = {"valid": true};
        // Iterate through all values retrieved and add to jsonObject
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            const val = values[i];
            // Validate input - if any values are invalid then set overall to invalid
            let valid = (!val) ? false : validateValues(val[0]);
            if (!valid) jsonObj['valid'] = false;
            jsonObj[key[0]] = {
                "valid": valid,
                "value": (val) ? val[0] : config.sheet.reserved
            };
        };
        return jsonObj;
    },
    updateJsonObjectAttributes: (objA, objB) => {
        // Add missing properties
        for (let property in objA) {
            // Skip valid property
            if(property === 'valid') continue;
            if (!objB[property]) {
                const data = {
                    valid: false,
                    value: config.sheet.reserved
                };
                objB[property] = data;
                // If new attribute is added then set valid to false
                objB['valid'] = false;
            } else {
                const data = {
                    valid: validateValues(objB[property]),
                    value: objB[property]
                };
                objB[property] = data;
            }
        }
        // Remove unused properties
        for (let property in objB) {
            if (!objA[property]) {
                delete objB[property];
            }
        }
        // Return updated json object
        return objB;
    },
    getAttributes: (file) => {
        let attributes = [];
        for(let property in file) {
            // Skip the valid property
            if (property === 'valid') continue;
            attributes.push([property]);
        }
        return attributes;
    },
    extractValues: (objA, jsonObj) => {
        let values = [];
        for(let property in objA) {
            // Skip the valid property
            if (property === 'valid') continue;
            values.push([jsonObj[property]['value']]);
        }
        return values;
    },
};

module.exports = service;