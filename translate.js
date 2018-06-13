const readline = require('readline');
const service = require('./service');
const config = require('./config')

console.log('Translation tool for Marketplace\n');
console.log('1: Update/validate translations from Google sheets');
console.log('2: Update files with new translations and upload to Google sheets\n');
console.log('0: Exit\n');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question("Choose from list\n", (input) => {
    rl.close();
    if (input === "0") {
        console.log("Closing...");
        process.exit();
    } else if (input === "1") {
        console.log("Updating files...");
        service.read(config.sheet.columns);
    } else if (input === '2') {
        console.log('Updating list...')
        service.update(config.sheet.columns);
    } else {
        console.log("Invalid input");
    }
});