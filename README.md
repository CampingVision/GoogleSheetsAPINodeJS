# Google Sheets API - Language Pack JSON
##### Node module to manage translation files for multi-linguistics applications

This Node module works together with Google Sheets API and is targeted maintaining a cross user manageable translation sheet. You can update locale JSON files from the Google Sheet along with updating the Google Sheet when new translations are added to your default translation files. Each cell and column is validated against missing values which is flagged in the given JSON file.

### Setup:

- Install [NodeJS](https://nodejs.org/en/)
- Clone the project and navigate to root folder
- Follow the guide from [Google Sheets Quickguide](https://developers.google.com/sheets/api/quickstart/nodejs) **Only do step 1. and 2.**
- Copy the ```client_secret.json``` to the root folder
- Run ```npm install```
- Create a Google Sheet and name the sheet tab at the bottom of the sheet to ```Translations```
- Add the default language JSON file in the files folder and create JSON files with an empty object ```{}``` for each language needed. **NOTE!** has to be ISO standard e.g. ```en.json, de.json```
- Change the ```config.js``` file to the appropriate data
- Run ```npm run setup``` , and follow the guide.
- Run ```npm run start``` to launch the application
- 1st time you start run option 2 to update the Google Sheets doc



### How to use

There are two options in the application when running ```npm run start```:

1. Update the locale files with the translations from the Google Sheet document. This will also validate the translations from the Google Sheet and indicate with red colors incorrect cells.
2. Will update the Google Sheet docs with the data from you locale JSON file.





### Attention:

To validate the cells the string ```-\-``` is used and therefore reserved. If you need to have translations with the given string please change the ```reserved``` value in the config file.



### Licensed: MIT