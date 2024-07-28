import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the geoData.js file
const filePath = path.join(__dirname, 'geoData.js');
const fileContent = fs.readFileSync(filePath, 'utf8');

// Remove the 'export const geoData = ' part and the trailing semicolon
let objectString = fileContent.replace('export const geoData = ', '').trim().slice(0, -1);

// Replace single quotes with double quotes and add double quotes to keys
// Escape existing double quotes inside the strings
objectString = objectString
  .replace(/'/g, '"')
  .replace(/(\w+):/g, '"$1":')
  .replace(/"([^"]*)"/g, (match, p1) => `"${p1.replace(/"/g, '\\"')}"`);

// Manually handle the embedded single quotes within city names by replacing `"` with `\"`
objectString = objectString.replace(/"Xi'an"/g, '"Xi\'an"');

// Parse the string to a JavaScript object
const geoData = JSON.parse(objectString);

// Function to sort the countries and cities
function sortGeoData(data) {
  const sortedData = {};
  const sortedCountries = Object.keys(data).sort();
  sortedCountries.forEach((country) => {
    sortedData[country] = data[country].sort();
  });
  return sortedData;
}

// Sort the geoData
const sortedGeoData = sortGeoData(geoData);

// Convert the sorted data back to a string
const sortedJsonString = JSON.stringify(sortedGeoData, null, 2);

// Create the new file content
const newFileContent = `export const geoData = ${sortedJsonString};`;

// Write the sorted data to a new file
const newFilePath = path.join(__dirname, 'sortedGeoData.js');
fs.writeFileSync(newFilePath, newFileContent);

console.log('Sorted geoData.js file has been created successfully.');

